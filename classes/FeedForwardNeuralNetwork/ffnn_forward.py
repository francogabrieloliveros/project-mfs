from math import log

import numpy as np

class FFNNForward:
    """Forward-pass, probability, loss, and gradient helpers for the FFNN."""

    def _get_input(self, context):
        """Look up each context embedding and concatenate them into one vector."""
        # Advanced indexing selects one embedding row for each context token.
        return self.embeddings[context].reshape(-1)

    def _calculate_hidden_layer(self, input_values):
        """Apply the hidden affine transform followed by ReLU activation."""
        # ReLU sets negative hidden activations to zero.
        return np.maximum(np.asarray(input_values) @ self.hidden_weights + self.hidden_bias, 0.0)

    def _calculate_output_layer(self, hidden_values):
        """Return unnormalized scores (logits), one per vocabulary token."""
        return np.asarray(hidden_values) @ self.output_weights + self.output_bias

    def _forward(self, context):
        """Compute next-token logits for one context."""
        input_values = self._get_input(context)
        hidden_values = self._calculate_hidden_layer(input_values)
        output_scores = self._calculate_output_layer(hidden_values)

        return output_scores

    def _softmax(self, scores):
        """Convert logits to probabilities using a numerically stable softmax."""
        scores = np.asarray(scores)
        # Subtracting the maximum keeps exponentials in a safe numeric range.
        exponentials = np.exp(scores - np.max(scores))
        return exponentials / np.sum(exponentials)

    def _calculate_loss(self, probabilities, target_word_id):
        """Calculate cross-entropy for the correct target token ID."""
        target_probability = probabilities[target_word_id]

        if target_probability <= 0.0:
            target_probability = 1e-12

        loss = -log(target_probability)

        return loss

    def _calculate_output_gradients(self, probabilities, target_word_id):
        """Differentiate softmax cross-entropy with respect to output logits."""
        output_gradients = np.asarray(probabilities).copy()
        output_gradients[target_word_id] -= 1.0
        return output_gradients
    

    def _calculate_output_weight_gradients(self, hidden_values, output_gradients):
        """Form the outer-product gradient for hidden-to-output weights."""
        return np.outer(hidden_values, output_gradients)


    def _calculate_output_bias_gradients(self, output_gradients):
        return np.asarray(output_gradients)

    def _calculate_hidden_gradients(self, hidden_values, output_weights, output_gradients):
        """Propagate output gradients through output weights and the ReLU mask."""
        gradients = output_weights @ np.asarray(output_gradients)
        return gradients * (np.asarray(hidden_values) > 0.0)
    

    def _calculate_hidden_weight_gradients(self, input_values, hidden_gradients):
        """Form the outer-product gradient for input-to-hidden weights."""
        return np.outer(input_values, hidden_gradients)


    def _calculate_hidden_bias_gradients(self, hidden_gradients):
        return np.asarray(hidden_gradients)

    def _calculate_input_gradients(self, hidden_gradients):
        """Propagate hidden gradients back to the flattened input embeddings."""
        return self.hidden_weights @ np.asarray(hidden_gradients)
    

    def _calculate_embedding_gradients(self, context, input_gradients):
        """Pair each context token ID with the gradient for its embedding row."""
        gradients = np.asarray(input_gradients).reshape(
            len(context), self.configuration.embedding_dimension
        )
        return list(zip(context, gradients))
