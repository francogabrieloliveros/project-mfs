
class FFNNForward:
    def _get_input(self, context):
        input_values = []

        for word_id in context:
            embedding = self.embeddings[word_id]

            for number in embedding:
                input_values.append(number)

        return input_values

    def _calculate_hidden_layer(self, input_values):
        hidden_values = []

        for neuron_index in range(self.configuration.hidden_layer_dimension):
            weighted_sum = 0.0

            for input_index in range(self.input_dimension):
                input_value = input_values[input_index]
                weight = self.hidden_weights[input_index][neuron_index]

                weighted_sum += input_value * weight

            weighted_sum += self.hidden_bias[neuron_index]

            if weighted_sum < 0:
                weighted_sum = 0.0

            hidden_values.append(weighted_sum)

        return hidden_values

    def _calculate_output_layer(self, hidden_values):
        output_scores = []

        for word_id in range(self.configuration.vocabulary_size):
            total = 0.0

            for neuron_index in range(len(hidden_values)):
                total += (
                    hidden_values[neuron_index]
                    * self.output_weights[neuron_index][word_id]
                )

            total += self.output_bias[word_id]
            output_scores.append(total)

        return output_scores

    def _forward(self, context):
        input_values = self._get_input(context)
        hidden_values = self._calculate_hidden_layer(input_values)
        output_scores = self._calculate_output_layer(hidden_values)

        return output_scores

    def _softmax(self, scores):
        largest_score = max(scores)
        exponentials = []
        total = 0.0

        # e
        for score in scores:
            exponential = 2.718281828459045 ** (score - largest_score)
            exponentials.append(exponential)
            total += exponential

        probabilities = []

        for exponential in exponentials:
            probabilities.append(exponential / total)

        return probabilities
