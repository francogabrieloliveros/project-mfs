from math import log

import numpy as np

class FFNNForward:

    # ------------------------------------------------------------------------
    # FORWARD PASS
    # ------------------------------------------------------------------------

    """
    - Converts context word IDs into embeddings
    - Calculates hidden layer values using ReLU activation
    - Calculates output scores for each word in the vocabulary
    """

    def _get_input(self, context):
        return self.embeddings[context].reshape(-1)

    def _calculate_hidden_layer(self, input_values):
        # ReLU sets negative to zero
        return np.maximum(np.asarray(input_values) @ self.hidden_weights + self.hidden_bias, 0.0)

    def _calculate_output_layer(self, hidden_values):
        return np.asarray(hidden_values) @ self.output_weights + self.output_bias

    def _forward(self, context):
        input_values = self._get_input(context)
        hidden_values = self._calculate_hidden_layer(input_values)
        output_scores = self._calculate_output_layer(hidden_values)

        return output_scores

    # ------------------------------------------------------------------------
    # PROBABILITIES AND LOSS
    # ------------------------------------------------------------------------

    """
        - Converts output scores into probabilities using softmax

        ? what is soft max

            1. u make everything positive
            2. add them all
            3. divide for percentage yay

        - Calculates cross-entropy loss based on the target word
    """

    def _softmax(self, scores):
        scores = np.asarray(scores)
        exponentials = np.exp(scores - np.max(scores))
        return exponentials / np.sum(exponentials)

    def _calculate_loss(self, probabilities, target_word_id):
        target_probability = probabilities[target_word_id]

        if target_probability <= 0.0:
            target_probability = 1e-12

        loss = -log(target_probability)

        return loss

    # ------------------------------------------------------------------------
    # OUTPUT LAYER GRADIENTS
    # ------------------------------------------------------------------------
    """
        - Calculates gradients for the output scores, weights, and bias
        - Prepares gradients for backpropagation
    """

    def _calculate_output_gradients(self, probabilities, target_word_id):
        output_gradients = np.asarray(probabilities).copy()
        output_gradients[target_word_id] -= 1.0
        return output_gradients
    
    def _calculate_output_weight_gradients(self, hidden_values, output_gradients):
        return np.outer(hidden_values, output_gradients)

    def _calculate_output_bias_gradients(self, output_gradients):
        return np.asarray(output_gradients)

    # ------------------------------------------------------------------------
    # HIDDEN LAYER GRADIENTS
    # ------------------------------------------------------------------------
    def _calculate_hidden_gradients(self, hidden_values, output_weights, output_gradients):
        gradients = output_weights @ np.asarray(output_gradients)
        return gradients * (np.asarray(hidden_values) > 0.0)

    def _calculate_hidden_weight_gradients(self, input_values, hidden_gradients):
        return np.outer(input_values, hidden_gradients)

    def _calculate_hidden_bias_gradients(self, hidden_gradients):
        return np.asarray(hidden_gradients)

    # ------------------------------------------------------------------------
    # INPUT AND EMBEDDING GRADIENTS
    # ------------------------------------------------------------------------
    def _calculate_input_gradients(self, hidden_gradients):
        return self.hidden_weights @ np.asarray(hidden_gradients)

    def _calculate_embedding_gradients(self, context, input_gradients):
        gradients = np.asarray(input_gradients).reshape(
            len(context), self.configuration.embedding_dimension
        )

        return list(zip(context, gradients))
