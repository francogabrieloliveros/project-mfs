"""
Helpful references:

}}} DATA BATCHING https://apxml.com/courses/introduction-to-neural-networks/chapter-2-data-preparation-neural-networks/data-batching

- builds training examples by pairing each context window with the next token
- initializes the FFNN's embeddings, weights, and biases
- predicts the next token, generates sequences, and trains the model
- saves and loads model parameters and configuration in NPZ files

"""

from pathlib import Path

import numpy as np

from .ffnn_configuration import FFNNConfiguration
from .ffnn_forward import FFNNForward
from .ffnn_sampling import FFNNSampling


def make_training_examples(ids, window_size):
    if len(ids) <= window_size:
        raise ValueError("ids must be longer than window_size")

    contexts = []
    targets = []

    for position in range(window_size, len(ids)):
        context = ids[position - window_size : position]
        target = ids[position]

        contexts.append(context)
        targets.append(target)

    return contexts, targets


class FeedForwardNeuralNetwork(FFNNForward, FFNNSampling):
    # ----------------------------------------------------------------------------
    # INITIALIZATION
    # ----------------------------------------------------------------------------

    """
    - stores the training data and model configuration
    - creates the random number generator used for sampling
    - initializes the embeddings, weights, and biases
    """

    def __init__(self, ids, vocabulary_size, configuration=None):
        if configuration is None:
            configuration = FFNNConfiguration(vocabulary_size=vocabulary_size)

        self.ids = ids
        self.configuration = configuration
        self.random_state = 42
        self.sampling_rng = np.random.default_rng()

        self.embeddings = np.empty(
            (
                self.configuration.vocabulary_size,
                self.configuration.embedding_dimension,
            ),
            dtype=np.float32,
        )
        word_id = 0
        while word_id < self.configuration.vocabulary_size:
            dimension = 0
            while dimension < self.configuration.embedding_dimension:
                self.embeddings[word_id, dimension] = self._random_value(-0.1, 0.1)
                dimension += 1
            word_id += 1

        self.input_dimension = (
            self.configuration.window_size * self.configuration.embedding_dimension
        )

        self.hidden_weights = np.empty(
            (self.input_dimension, self.configuration.hidden_layer_dimension),
            dtype=np.float32,
        )
        input_index = 0
        while input_index < self.input_dimension:
            neuron_index = 0
            while neuron_index < self.configuration.hidden_layer_dimension:
                self.hidden_weights[input_index, neuron_index] = self._random_value(
                    -0.1, 0.1
                )
                neuron_index += 1
            input_index += 1

        self.hidden_bias = np.zeros(
            self.configuration.hidden_layer_dimension, dtype=np.float32
        )

        self.output_weights = np.empty(
            (
                self.configuration.hidden_layer_dimension,
                self.configuration.vocabulary_size,
            ),
            dtype=np.float32,
        )
        neuron_index = 0
        while neuron_index < self.configuration.hidden_layer_dimension:
            word_id = 0
            while word_id < self.configuration.vocabulary_size:
                self.output_weights[neuron_index, word_id] = self._random_value(
                    -0.1, 0.1
                )
                word_id += 1
            neuron_index += 1

        self.output_bias = np.zeros(
            self.configuration.vocabulary_size, dtype=np.float32
        )

    def _random_value(self, minimum, maximum):
        self.random_state = (67 * self.random_state + 12345) % (2**31)

        fraction = self.random_state / (2**31 - 1)

        return minimum + fraction * (maximum - minimum)

    def predict_next(self, context, temperature=0.0, top_k=40, blocked_ids=()):
        output_scores = self._forward(context)

        result, candidates = self._sample(
            output_scores, temperature, top_k, blocked_ids
        )

        return result, candidates

    # ----------------------------------------------------------------------------
    # TEXT GENERATION
    # ----------------------------------------------------------------------------

    """
        - repeatedly predicts and adds the next word to the generated sequence
        - updates the context after each new word
        - stops when the eos token is selected or the token limit is reached
    """

    def generate(
        self,
        context,
        max_tokens,
        temperature=0.0,
        top_k=40,
        blocked_ids=(),
        min_tokens_before_eos=19,
    ):
        if len(context) != self.configuration.window_size:
            raise ValueError("context must match window_size")

        generated_ids = []
        current_context = context.copy()

        for i in range(max_tokens):
            current_blocked_ids = tuple(blocked_ids)
            if len(generated_ids) < min_tokens_before_eos:
                current_blocked_ids += (self.configuration.eos_id,)

            result, candidates = self.predict_next(
                current_context, temperature, top_k, current_blocked_ids
            )

            next_word_id = result[0]

            if next_word_id == self.configuration.eos_id:
                break

            generated_ids.append(next_word_id)

            current_context = current_context[1:]
            current_context.append(next_word_id)

        return generated_ids

    def _update_parameters(
        self,
        context,
        output_weight_gradients,
        output_bias_gradients,
        hidden_weight_gradients,
        hidden_bias_gradients,
        embedding_gradients,
        learning_rate,
    ):
        self.output_weights -= learning_rate * output_weight_gradients
        self.output_bias -= learning_rate * output_bias_gradients
        self.hidden_weights -= learning_rate * hidden_weight_gradients
        self.hidden_bias -= learning_rate * hidden_bias_gradients

        word_ids = np.asarray([word_id for word_id, _ in embedding_gradients])
        gradients = np.asarray(
            [gradient for _, gradient in embedding_gradients], dtype=np.float32
        )
        np.add.at(self.embeddings, word_ids, -learning_rate * gradients)

    def _train_example(self, context, target_word_id, learning_rate):
        input_values = self._get_input(context)
        hidden_values = self._calculate_hidden_layer(input_values)
        output_scores = self._calculate_output_layer(hidden_values)
        probabilities = self._softmax(output_scores)

        loss = self._calculate_loss(probabilities, target_word_id)

        output_gradients = self._calculate_output_gradients(
            probabilities, target_word_id
        )

        output_weight_gradients = self._calculate_output_weight_gradients(
            hidden_values, output_gradients
        )

        output_bias_gradients = self._calculate_output_bias_gradients(output_gradients)

        hidden_gradients = self._calculate_hidden_gradients(
            hidden_values, self.output_weights, output_gradients
        )

        hidden_weight_gradients = self._calculate_hidden_weight_gradients(
            input_values, hidden_gradients
        )

        hidden_bias_gradients = self._calculate_hidden_bias_gradients(hidden_gradients)

        input_gradients = self._calculate_input_gradients(hidden_gradients)

        embedding_gradients = self._calculate_embedding_gradients(
            context, input_gradients
        )

        self._update_parameters(
            context,
            output_weight_gradients,
            output_bias_gradients,
            hidden_weight_gradients,
            hidden_bias_gradients,
            embedding_gradients,
            learning_rate,
        )

        return loss

    # ----------------------------------------------------------------------------
    # DATA BATCHING (OPTIMIZATION PURPOSES)
    # ---------------------------------------------------------------------------

    """
        - Processes several training examples together
        - Calculates predictions, probabilities, and average loss for the batch
        - Calculates gradients for the batch
        - Updates the weights, biases, and embeddings once for the batch

    """

    def _train_batch(self, contexts, targets, learning_rate):
        batch_size = len(contexts)
        row_indices = np.arange(batch_size)

        inputs = self.embeddings[contexts].reshape(batch_size, self.input_dimension)
        hidden_pre_activation = inputs @ self.hidden_weights + self.hidden_bias
        hidden_values = np.maximum(hidden_pre_activation, np.float32(0.0))
        output_scores = hidden_values @ self.output_weights + self.output_bias

        output_scores -= np.max(output_scores, axis=1, keepdims=True)
        probabilities = np.exp(output_scores)
        probabilities /= np.sum(probabilities, axis=1, keepdims=True)

        target_probabilities = np.maximum(
            probabilities[row_indices, targets], np.float32(1e-12)
        )
        loss = float(-np.mean(np.log(target_probabilities)))

        output_gradients = probabilities
        output_gradients[row_indices, targets] -= 1.0
        output_gradients /= batch_size

        output_weight_gradients = hidden_values.T @ output_gradients
        output_bias_gradients = np.sum(output_gradients, axis=0)

        hidden_gradients = output_gradients @ self.output_weights.T
        hidden_gradients *= hidden_pre_activation > 0.0
        hidden_weight_gradients = inputs.T @ hidden_gradients
        hidden_bias_gradients = np.sum(hidden_gradients, axis=0)

        input_gradients = (hidden_gradients @ self.hidden_weights.T).reshape(
            batch_size,
            self.configuration.window_size,
            self.configuration.embedding_dimension,
        )

        self.output_weights -= learning_rate * output_weight_gradients
        self.output_bias -= learning_rate * output_bias_gradients
        self.hidden_weights -= learning_rate * hidden_weight_gradients
        self.hidden_bias -= learning_rate * hidden_bias_gradients

        embedding_word_ids = contexts.reshape(-1)
        embedding_gradients = input_gradients.reshape(
            -1, self.configuration.embedding_dimension
        )
        np.add.at(
            self.embeddings,
            embedding_word_ids,
            -learning_rate * embedding_gradients,
        )

        return loss

    # ----------------------------------------------------------------------------
    # MODEL TRAINING
    # ----------------------------------------------------------------------------

    """
        - creates the training examples from the word IDs
        - trains the model over multiple epochs using batches
        - displays training progress and average loss for each epoch
    """

    def fit(self, epochs=10, learning_rate=None, batch_size=32):
        contexts, targets = make_training_examples(
            self.ids, self.configuration.window_size
        )

        contexts = np.asarray(contexts, dtype=np.int64)
        targets = np.asarray(targets, dtype=np.int64)
        progress_interval = max(1, len(contexts) // (batch_size * 100))

        for epoch in range(epochs):
            print(f"Epoch {epoch + 1}/{epochs}")
            total_loss = 0.0
            print(
                f"Preparing {len(contexts)} training examples, batching size: {batch_size}.",
                flush=True,
            )

            for batch_start in range(0, len(contexts), batch_size):
                batch_end = min(batch_start + batch_size, len(contexts))
                loss = self._train_batch(
                    contexts[batch_start:batch_end],
                    targets[batch_start:batch_end],
                    learning_rate,
                )
                total_loss += loss * (batch_end - batch_start)

                completed = batch_end
                if (
                    batch_start // batch_size % progress_interval == 0
                    or completed == len(contexts)
                ):
                    percentage = completed * 100 // len(contexts)
                    print(
                        f"\r  Training: {completed}/{len(contexts)} "
                        f"examples ({percentage}%)"
                    )

            average_loss = total_loss / len(contexts)

            print("Epoch", epoch + 1, "Average loss:", average_loss)

    # ----------------------------------------------------------------------------
    # SAVE AND LOADING
    # ----------------------------------------------------------------------------

    """
        - saves and loads the model configuration and learned parameters to an NPZ file
        - allows the trained model to be loaded later without training from scratch
    """

    def save(self, file_path):
        file_path = Path(file_path)

        with file_path.open("wb") as file:
            np.savez(
                file,
                vocabulary_size=np.int64(self.configuration.vocabulary_size),
                window_size=np.int64(self.configuration.window_size),
                embedding_dimension=np.int64(self.configuration.embedding_dimension),
                hidden_layer_dimension=np.int64(
                    self.configuration.hidden_layer_dimension
                ),
                learning_rate=np.float32(self.configuration.learning_rate),
                eos_id=np.int64(self.configuration.eos_id),
                embeddings=self.embeddings,
                hidden_weights=self.hidden_weights,
                hidden_bias=self.hidden_bias,
                output_weights=self.output_weights,
                output_bias=self.output_bias,
                random_state=np.int64(self.random_state),
            )

        print("Model saved to", file_path)

    @classmethod
    def load(cls, file_path):
        file_path = Path(file_path)

        with np.load(file_path, allow_pickle=False) as archive:
            embeddings = archive["embeddings"]
            hidden_weights = archive["hidden_weights"]
            hidden_bias = archive["hidden_bias"]
            output_weights = archive["output_weights"]
            output_bias = archive["output_bias"]
            random_state = int(archive["random_state"].item())

            if "window_size" in archive:
                configuration_data = {
                    "vocabulary_size": int(archive["vocabulary_size"].item()),
                    "window_size": int(archive["window_size"].item()),
                    "embedding_dimension": int(archive["embedding_dimension"].item()),
                    "hidden_layer_dimension": int(
                        archive["hidden_layer_dimension"].item()
                    ),
                    "learning_rate": float(archive["learning_rate"].item()),
                    "eos_id": int(archive["eos_id"].item()),
                }
            else:
                embedding_dimension = embeddings.shape[1]
                configuration_data = {
                    "vocabulary_size": embeddings.shape[0],
                    "window_size": hidden_weights.shape[0] // embedding_dimension,
                    "embedding_dimension": embedding_dimension,
                    "hidden_layer_dimension": hidden_weights.shape[1],
                    "learning_rate": FFNNConfiguration.CURRENT_CONFIGURATION[
                        "learning_rate"
                    ],
                    "eos_id": 1,
                }

        configuration = FFNNConfiguration(
            vocabulary_size=configuration_data["vocabulary_size"],
            configuration={
                "window_size": configuration_data["window_size"],
                "embedding_dimension": configuration_data["embedding_dimension"],
                "hidden_layer_dimension": configuration_data["hidden_layer_dimension"],
                "learning_rate": configuration_data["learning_rate"],
                "eos_id": configuration_data.get("eos_id", 1),
            },
        )

        model = cls(
            ids=[],
            vocabulary_size=configuration.vocabulary_size,
            configuration=configuration,
        )

        model.embeddings = np.asarray(embeddings, dtype=np.float32)
        model.hidden_weights = np.asarray(hidden_weights, dtype=np.float32)
        model.hidden_bias = np.asarray(hidden_bias, dtype=np.float32)
        model.output_weights = np.asarray(output_weights, dtype=np.float32)
        model.output_bias = np.asarray(output_bias, dtype=np.float32)
        model.random_state = random_state

        return model
