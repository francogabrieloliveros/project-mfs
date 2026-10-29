# to do:
# ffnn configuration DONE
# training example DONE
# word embedding DONE
# hidden-layer weight and bias DONE
# output-layer weight and bias DONE
# combining embeddings into an input vector DONE
# hidden-neuron calculations DONE
# output scores and next-word prediction DONE
# training and weight updates etc etc
# ----------------------------------------------------------
import json
from pathlib import Path

import numpy as np

from .ffnn_configuration import FFNNConfiguration
from .ffnn_sampling import FFNNSampling
from .ffnn_forward import FFNNForward

def make_training_examples(ids, window_size):
    if len(ids) <= window_size:
        raise ValueError("ids must be longer than window_size")

    contexts = []
    targets = []

    for position in range(window_size, len(ids)):
        context = ids[position - window_size:position]
        target = ids[position]

        contexts.append(context)
        targets.append(target)

    return contexts, targets

class FeedForwardNeuralNetwork(FFNNForward, FFNNSampling):
    def __init__(self, ids, vocabulary_size, configuration=None):
        if configuration is None:
            configuration = FFNNConfiguration(vocabulary_size=vocabulary_size)        
        
        self.ids = ids
        self.configuration = configuration
        self.embeddings = []
        self.random_state = 42
        
        for word_id in range(self.configuration.vocabulary_size):
            embedding = []

            for number in range(self.configuration.embedding_dimension):
                embedding.append(self._random_value(-0.1, 0.1))

            self.embeddings.append(embedding)
        
        self.input_dimension = (
            self.configuration.window_size * self.configuration.embedding_dimension
        )

        self.hidden_weights = []

        for input_index in range(self.input_dimension):
            weights = []

            for neuron_index in range(self.configuration.hidden_layer_dimension):
                weights.append(self._random_value(-0.1, 0.1))

            self.hidden_weights.append(weights)

        self.hidden_bias = []

        for neuron_index in range(self.configuration.hidden_layer_dimension):
            self.hidden_bias.append(0.0)
        
        self.output_weights = []

        for neuron_index in range(self.configuration.hidden_layer_dimension):
            weights = []

            for word_id in range(self.configuration.vocabulary_size):
                weights.append(self._random_value(-0.1, 0.1))

            self.output_weights.append(weights)

        self.output_bias = []

        for word_id in range(self.configuration.vocabulary_size):
            self.output_bias.append(0.0)

        self.embeddings = np.asarray(self.embeddings, dtype=np.float32)
        self.hidden_weights = np.asarray(self.hidden_weights, dtype=np.float32)
        self.hidden_bias = np.asarray(self.hidden_bias, dtype=np.float32)
        self.output_weights = np.asarray(self.output_weights, dtype=np.float32)
        self.output_bias = np.asarray(self.output_bias, dtype=np.float32)
                                
    def _random_value(self, minimum, maximum):
        self.random_state = (
            # SIXX SEVENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN
            67 * self.random_state + 12345
        ) % (2 ** 31)

        fraction = self.random_state / (2 ** 31 - 1)

        return minimum + fraction * (maximum - minimum)

    def predict_next(self, context, temperature=0.0, top_k=40, blocked_ids=()):
        output_scores = self._forward(context)

        result, candidates = self._sample(
            output_scores,
            temperature,
            top_k,
            blocked_ids
        )

        return result, candidates

    
    def generate(self, context, max_tokens, temperature=0.0, top_k=40, blocked_ids=()):
        if len(context) != self.configuration.window_size:
            raise ValueError("context must match window_size")

        if max_tokens < 0:
            raise ValueError("max_tokens must be at least 0")

        generated_ids = []
        current_context = context.copy()

        for number in range(max_tokens):
            result, candidates = self.predict_next(
                current_context,
                temperature,
                top_k,
                blocked_ids
            )

            next_word_id = result[0]

            generated_ids.append(next_word_id)

            current_context = current_context[1:]
            current_context.append(next_word_id)

        return generated_ids

    def _update_parameters(self, context, output_weight_gradients, output_bias_gradients, hidden_weight_gradients, hidden_bias_gradients, embedding_gradients, learning_rate):
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
            probabilities,
            target_word_id
        )

        output_weight_gradients = self._calculate_output_weight_gradients(
            hidden_values,
            output_gradients
        )

        output_bias_gradients = self._calculate_output_bias_gradients(
            output_gradients
        )

        hidden_gradients = self._calculate_hidden_gradients(
            hidden_values,
            self.output_weights,
            output_gradients
        )

        hidden_weight_gradients = self._calculate_hidden_weight_gradients(
            input_values,
            hidden_gradients
        )

        hidden_bias_gradients = self._calculate_hidden_bias_gradients(
            hidden_gradients
        )

        input_gradients = self._calculate_input_gradients(hidden_gradients)

        embedding_gradients = self._calculate_embedding_gradients(
            context,
            input_gradients
        )

        self._update_parameters(
            context,
            output_weight_gradients,
            output_bias_gradients,
            hidden_weight_gradients,
            hidden_bias_gradients,
            embedding_gradients,
            learning_rate
        )

        return loss

    def fit(self, epochs=10, learning_rate=None):
        contexts, targets = make_training_examples(
            self.ids,
            self.configuration.window_size
        )

        if learning_rate is None:
            learning_rate = self.configuration.learning_rate

        if epochs < 1:
            raise ValueError("epochs must be at least 1")

        if learning_rate <= 0:
            raise ValueError("learning_rate must be greater than 0")

        for epoch in range(epochs):
            print(f"Epoch {epoch + 1}/{epochs}")
            total_loss = 0.0
            progress_interval = max(1, len(contexts) // 100)
            
            print(f"preape {len(contexts)} training examples.", flush=True)
            for example_index in range(len(contexts)):
                loss = self._train_example(
                    contexts[example_index],
                    targets[example_index],
                    learning_rate
                )
                total_loss += loss

                completed = example_index + 1
                if completed % progress_interval == 0 or completed == len(contexts):
                    percentage = completed * 100 // len(contexts)
                    print(
                        f"\r  Training: {completed}/{len(contexts)} "
                        f"examples ({percentage}%)",
                        end="\n" if completed == len(contexts) else "",
                        flush=True
                    )

            average_loss = total_loss / len(contexts)

            print(
                "Epoch", epoch + 1,
                "Average loss:", average_loss
            )

    def save(self, file_path):
        file_path = Path(file_path)
        model_data = {
            "configuration": {
                "vocabulary_size": self.configuration.vocabulary_size,
                "window_size": self.configuration.window_size,
                "embedding_dimension": self.configuration.embedding_dimension,
                "hidden_layer_dimension": self.configuration.hidden_layer_dimension,
                "learning_rate": self.configuration.learning_rate
            },
            "embeddings": self.embeddings.tolist(),
            "hidden_weights": self.hidden_weights.tolist(),
            "hidden_bias": self.hidden_bias.tolist(),
            "output_weights": self.output_weights.tolist(),
            "output_bias": self.output_bias.tolist(),
            "random_state": self.random_state
        }

        if file_path.suffix == ".npz":
            with file_path.open("wb") as file:
                np.savez(
                    file,
                    configuration=np.array(json.dumps(model_data["configuration"])),
                    embeddings=self.embeddings,
                    hidden_weights=self.hidden_weights,
                    hidden_bias=self.hidden_bias,
                    output_weights=self.output_weights,
                    output_bias=self.output_bias,
                    random_state=np.int64(self.random_state)
                )
            print("Model saved to", file_path)
            return

        with open(file_path, "w") as file:
            json.dump(model_data, file)

        print("Model saved to", file_path)

    @classmethod
    def load(cls, file_path):
        file_path = Path(file_path)
        if file_path.suffix == ".npz":
            with np.load(file_path, allow_pickle=False) as archive:
                model_data = {
                    "configuration": json.loads(archive["configuration"].item()),
                    "embeddings": archive["embeddings"],
                    "hidden_weights": archive["hidden_weights"],
                    "hidden_bias": archive["hidden_bias"],
                    "output_weights": archive["output_weights"],
                    "output_bias": archive["output_bias"],
                    "random_state": int(archive["random_state"].item())
                }
        else:
            with file_path.open("r") as file:
                model_data = json.load(file)

        
        configuration_data = model_data["configuration"]

        configuration = FFNNConfiguration(
            vocabulary_size=configuration_data["vocabulary_size"],
            configuration={
                "window_size": configuration_data["window_size"],
                "embedding_dimension": configuration_data["embedding_dimension"],
                "hidden_layer_dimension": configuration_data["hidden_layer_dimension"],
                "learning_rate": configuration_data["learning_rate"]
            }
        )

        model = cls(
            ids=[],
            vocabulary_size=configuration.vocabulary_size,
            configuration=configuration
        )

        model.embeddings = np.asarray(model_data["embeddings"], dtype=np.float32)
        model.hidden_weights = np.asarray(model_data["hidden_weights"], dtype=np.float32)
        model.hidden_bias = np.asarray(model_data["hidden_bias"], dtype=np.float32)
        model.output_weights = np.asarray(model_data["output_weights"], dtype=np.float32)
        model.output_bias = np.asarray(model_data["output_bias"], dtype=np.float32)
        model.random_state = model_data["random_state"]

        return model
