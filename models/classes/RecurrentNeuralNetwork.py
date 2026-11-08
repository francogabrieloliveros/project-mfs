import numpy as np
from tqdm import tqdm


class RecurrentNeuralNetwork:
    def __init__(
        self, ids, vocab_size, embed_dim=64, hidden_dim=128, learning_rate=1.0
    ):
        """
        Initialize values randomly from seed 0.

        embed_dim: The size of vector for each word. Can be used for differentiation
        like verbs, subject, adjective etc.

        hidden_dim: Hidden layer dimension. How much the network can remember about
        the whole sentence so far.
        """
        rng = np.random.default_rng(seed=0)  # Same seed for reproducible results

        self.ids = ids
        self.config = (vocab_size, embed_dim, hidden_dim)
        self.learning_rate = learning_rate

        # For LSTM there are 4 gates: one weight and bias is needed for each gate
        # The arrays will be of size (hidden_dim * 4): Input, Forget, Candidate, Output
        # Initial values will either be random or 0s
        limit = 1 / np.sqrt(hidden_dim)
        self.params = {
            "embeddings": rng.uniform(-0.1, 0.1, (vocab_size, embed_dim)),
            "word_weights": rng.uniform(-limit, limit, (embed_dim, 4 * hidden_dim)),
            "stm_weights": rng.uniform(-limit, limit, (hidden_dim, 4 * hidden_dim)),
            "gate_bias": np.zeros(hidden_dim * 4),
            "output_weights": rng.uniform(-limit, limit, (hidden_dim, vocab_size)),
            "output_bias": np.zeros(vocab_size),
        }

        # Make forget bias (2nd block) 1s
        self.params["gate_bias"][hidden_dim : 2 * hidden_dim] = 1.0
        self.params = {k: v.astype(np.float32) for k, v in self.params.items()}

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------
    @staticmethod
    def _sigmoid(z):
        """
        Activation function 1/(1 + e^z) to convert value to number between 0 and 1.
        """
        return 1 / (1 + np.exp(-z))

    @staticmethod
    def _softmax(scores):
        """
        Convert scores to probabilities that sum to 1 for each row.

        axis = -1 to perform operations across row
        keepdims = True to not flatten the array
        """
        # Subtract each value from row max to avoid very large numbers
        scores = scores - scores.max(axis=-1, keepdims=True)
        exponential = np.exp(scores)
        return exponential / exponential.sum(axis=-1, keepdims=True)

    # ------------------------------------------------------------------
    # Traning Helpers
    # ------------------------------------------------------------------
    def _step(self, word_ids, stms, ltms):
        """Calculate one LSTM step values through a chunk of word_ids."""
        word_vectors = self.params["embeddings"][word_ids]

        # Perform LSTM sums for all blocks
        gate_sums = (
            word_vectors @ self.params["word_weights"]
            + stms @ self.params["stm_weights"]
            + self.params["gate_bias"]
        )

        # Gate results after running each block through activation functions
        hidden_dim = self.config[2]
        input_gate = self._sigmoid(gate_sums[:, :hidden_dim])
        forget_gate = self._sigmoid(gate_sums[:, hidden_dim : 2 * hidden_dim])
        candidate = np.tanh(gate_sums[:, 2 * hidden_dim : 3 * hidden_dim])
        output_gate = self._sigmoid(gate_sums[:, 3 * hidden_dim :])

        # Calculate new stm and ltm
        new_ltm = forget_gate * ltms + input_gate * candidate
        tanh_of_ltm = np.tanh(new_ltm)
        new_stm = tanh_of_ltm * output_gate

        return (
            new_stm,
            new_ltm,
            (
                word_vectors,
                stms,
                ltms,
                input_gate,
                forget_gate,
                candidate,
                output_gate,
                tanh_of_ltm,
            ),
        )

    def _forward_propagation(self, input_ids, next_ids, stm, ltm):
        """
        Perform forward pass over by chunks and calculate loss.
        """

        batch_size, num_steps = input_ids.shape

        # Calculate stms, ltms, and other values for each input word chunk
        stms, ltms, caches = [], [], []
        for t in range(num_steps):
            stm, ltm, cache = self._step(input_ids[:, t], stm, ltm)
            stms.append(stm)
            ltms.append(ltm)
            caches.append(cache)
        all_stm = np.stack(stms, axis=1)  # rearrange stms

        # softmax(y = x * w + b)
        probabilities = self._softmax(
            all_stm @ self.params["output_weights"] + self.params["output_bias"]
        )

        batch_index = np.arange(batch_size)[:, None]  # batch_size * 1 2d array
        time_index = np.arange(num_steps)[None, :]  # 1 * num_steps 2d array
        correct_word_probs = probabilities[batch_index, time_index, next_ids]

        # Cross entropy
        #           1   N
        # loss  = - ─ · Σ  ln(p_n)
        #           N  n=1
        # Small num 1e-9 added to prevent ln(0) = -inf
        loss = -np.log(correct_word_probs + 1e-9).mean()

        return loss, stm, ltm, caches, all_stm, probabilities

    def _backward_propagation(
        self, input_ids, next_ids, caches, all_stm, probabilities
    ):
        """Calculate how much each parameter contributed to the loss (its gradient)."""
        batch_size, num_steps = input_ids.shape
        hidden_dim = self.config[2]

        # Same shape as params but full of 0s
        gradients = {name: np.zeros_like(value) for name, value in self.params.items()}

        # dY
        # Reuse probabilities, subtract 1 from correct indices due to softmax
        # divide gradients by batch_size * num_steps since loss came from mean calc
        batch_index = np.arange(batch_size)[:, None]
        time_index = np.arange(num_steps)[None, :]
        score_gradients = probabilities
        score_gradients[batch_index, time_index, next_ids] -= 1.0
        score_gradients /= batch_size

        # reshape(-1, n) flattens (batch, steps, n) into (batch * steps, n)
        # Tranxpose X x dY
        gradients["output_weights"] = all_stm.reshape(
            -1, hidden_dim
        ).T @ score_gradients.reshape(-1, score_gradients.shape[-1])

        # The bias is added to every position and simplify to 1D array
        gradients["output_bias"] = score_gradients.sum(axis=(0, 1))

        # dY x transpose W
        input_gradient = score_gradients @ self.params["output_weights"].T

        next_stm_gradient = np.zeros((batch_size, hidden_dim), dtype=np.float32)
        next_ltm_gradient = np.zeros((batch_size, hidden_dim), dtype=np.float32)
        for t in reversed(range(num_steps)):
            (
                word_vectors,
                prev_stm,
                prev_ltm,
                input_gate,
                forget_gate,
                candidate,
                output_gate,
                tanh_of_ltm,
            ) = caches[t]
            stm_gradient = input_gradient[:, t] + next_stm_gradient  # Add stms

            # new_ltm also affects the next step, so add next_ltm_gradient
            # (1 - tanh^2) is the derivative of tanh.
            ltm_gradient = (
                stm_gradient * output_gate * (1 - tanh_of_ltm**2) + next_ltm_gradient
            )

            # Forward: new_stm = tanh_of_ltm * output_gate
            output_gate_gradient = stm_gradient * tanh_of_ltm

            # Forward: new_ltm = forget_gate * prev_ltm + input_gate * candidate
            forget_gate_gradient = ltm_gradient * prev_ltm
            input_gate_gradient = ltm_gradient * candidate
            candidate_gradient = ltm_gradient * input_gate

            # Go back through the activation functions to the raw sums
            # sigmoid derivative: s * (1 - s)     tanh derivative: 1 - t^2
            gate_sums_gradient = np.concatenate(
                [
                    input_gate_gradient * input_gate * (1 - input_gate),
                    forget_gate_gradient * forget_gate * (1 - forget_gate),
                    candidate_gradient * (1 - candidate**2),
                    output_gate_gradient * output_gate * (1 - output_gate),
                ],
                axis=1,
            )

            # Forward: gate_sums = word_vectors @ word_weights
            #                      + prev_stm @ stm_weights + gate_bias
            gradients["word_weights"] += word_vectors.T @ gate_sums_gradient
            gradients["stm_weights"] += prev_stm.T @ gate_sums_gradient
            gradients["gate_bias"] += gate_sums_gradient.sum(axis=0)

            # Gradient for the embedding rows of the words used at this step
            word_vectors_gradient = gate_sums_gradient @ self.params["word_weights"].T
            np.add.at(gradients["embeddings"], input_ids[:, t], word_vectors_gradient)

            next_stm_gradient = gate_sums_gradient @ self.params["stm_weights"].T
            next_ltm_gradient = ltm_gradient * forget_gate

        return gradients

    # ------------------------------------------------------------------
    # Training
    # ------------------------------------------------------------------
    def fit(self, epochs=15, batch_size=64, seq_len=32, clip=5.0):
        """
        Train with Stochastic Gradient Descent on self.ids and Truncated
        Backpropagation Through Time.

        epochs: number of fitting iterations
        batch_size: how much words are in a batch
        seq_len: number of batch to process at a time
        clip: top limit of scale
        """
        # Split ids into batch arrays
        data = np.asarray(self.ids)
        n = (len(data) - 1) // batch_size
        input_ids = data[: n * batch_size].reshape(batch_size, n)
        shifted_ids = data[1 : n * batch_size + 1].reshape(batch_size, n)
        learning_rate = self.learning_rate

        print("RNN training initiated...")
        for epoch in range(epochs):
            stm = np.zeros((batch_size, self.config[2]), dtype=np.float32)
            ltm = np.zeros_like(stm)
            losses = []

            # Scale down lr on epochs after 3 to avoid noise
            if epoch > 3:
                learning_rate *= 0.6

            progress = tqdm(range(0, n, seq_len), desc=f"Epoch {epoch + 1}/{epochs}")
            for i in progress:
                chunk_inputs = input_ids[:, i : i + seq_len]
                chunk_targets = shifted_ids[:, i : i + seq_len]

                loss, stm, ltm, caches, all_stm, probabilities = (
                    self._forward_propagation(chunk_inputs, chunk_targets, stm, ltm)
                )
                gradient = self._backward_propagation(
                    chunk_inputs, chunk_targets, caches, all_stm, probabilities
                )

                norm = np.sqrt(sum((v**2).sum() for v in gradient.values()))
                scale = min(1.0, clip / (norm + 1e-9))  # cap at 1

                # Gradient descent
                for key in self.params:
                    self.params[key] -= learning_rate * scale * gradient[key]
                losses.append(loss)
                progress.set_postfix(loss=f"{np.mean(losses[-20:]):.3f}")

            print(f"Epoch {epoch + 1}: loss {np.mean(losses):.3f}  ")
            self.save("training/rnn.npz")

    # ------------------------------------------------------------------
    # Prediction
    # ------------------------------------------------------------------
    def _read_prompt(self, prompt):
        """Run prompt ids through LSTM and score every word as the next word."""
        # Just start with zeros for first iteration
        stm = np.zeros((1, self.config[2]), dtype=np.float32)
        ltm = np.zeros_like(stm)

        # Place words into memory
        for word_id in prompt:
            stm, ltm, _ = self._step(np.array([word_id]), stm, ltm)

        scores = stm @ self.params["output_weights"] + self.params["output_bias"]

        return (
            scores,
            stm,
            ltm,
        )

    def _sample(self, scores, temperature, top_k, blocked_ids=()):
        """
        Pick a word from a 1D array of scores.

        temperature: controls creativity
        top_k: limits the number of words to choose from
        blocked_ids: word ids that can never be chosen (e.g. <unk>)
        """
        scores = scores.copy()
        scores[list(blocked_ids)] = -np.inf
        top_ids = np.argsort(scores)[-top_k:][::-1]  # descending

        if temperature == 0:
            probabilities = self._softmax(scores[top_ids])
            position = 0
        else:
            probabilities = self._softmax(scores[top_ids] / temperature)
            position = np.random.choice(len(top_ids), p=probabilities)

        chosen = (int(top_ids[position]), float(probabilities[position]))
        candidates = [(int(i), float(p)) for i, p in zip(top_ids, probabilities)]
        return chosen, candidates

    def predict_next(self, prompt, temperature=0.0, top_k=40, blocked_ids=()):
        scores = self._read_prompt(prompt)[0][0]
        return self._sample(scores, temperature, top_k, blocked_ids)

    def generate(self, prompt, max_tokens, temperature=0.0, top_k=40, blocked_ids=()):
        scores, stm, ltm = self._read_prompt(prompt)  # read the prompt once
        generated = []

        for _ in range(max_tokens):
            (next_id, _), _ = self._sample(scores[0], temperature, top_k, blocked_ids)
            generated.append(next_id)
            stm, ltm, _ = self._step(np.array([next_id]), stm, ltm)
            scores = stm @ self.params["output_weights"] + self.params["output_bias"]

        return generated

    # ------------------------------------------------------------------
    # Save / load
    # ------------------------------------------------------------------
    def save(self, path):
        """Save weights, shape config and learning rate to an .npz file."""
        print(f"Weights and data saved to {path}.")
        np.savez(
            path,
            config=np.array(self.config),
            learning_rate=np.array(self.learning_rate),
            **self.params,
        )

    def load(self, path):
        """Load saved weights into model."""
        print(f"Loading weights and saved data from {path}.")
        data = np.load(path)

        for name in self.params:
            self.params[name] = data[name].astype(np.float32)
        self.learning_rate = float(data["learning_rate"])
        self.config = tuple(int(value) for value in data["config"])
