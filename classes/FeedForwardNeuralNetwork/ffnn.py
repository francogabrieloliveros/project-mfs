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

from ffnn_configuration import FFNNConfiguration

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

class FeedForwardNeuralNetwork:
    def __init__(self, configuration):
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
            weighted_sum = 0.0

            for neuron_index in range(self.configuration.hidden_layer_dimension):
                hidden_value = hidden_values[neuron_index]
                weight = self.output_weights[neuron_index][word_id]

                weighted_sum += hidden_value * weight

            weighted_sum += self.output_bias[word_id]

            output_scores.append(weighted_sum)

        return output_scores
                                
    def _random_value(self, minimum, maximum):
        self.random_state = (
            # SIXX SEVENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN
            67 * self.random_state + 12345
        ) % (2 ** 31)

        fraction = self.random_state / (2 ** 31 - 1)

        return minimum + fraction * (maximum - minimum)


    def _forward(self, context):
        input_values = self._get_input(context)
        hidden_values = self._calculate_hidden_layer(input_values)
        output_scores = self._calculate_output_layer(hidden_values)

        return output_scores


    def _softmax(self, scores):
        exponentials = []
        total = 0.0
        
        # e 
        for score in scores:
            exponential = 2.718281828459045 ** score
            exponentials.append(exponential)
            total += exponential

        probabilities = []

        for exponential in exponentials:
            probability = exponential / total
            probabilities.append(probability)

        return probabilities


    def predict_next(self, context):
        output_scores = self._forward(context)
        probabilities = self._softmax(output_scores)
        predicted_word_id = probabilities.index(max(probabilities))

        return predicted_word_id

def ffnn():
    ids = [4, 8, 2, 9, 1]
    configuration = FFNNConfiguration(vocabulary_size = 10)

    contexts, targets = make_training_examples(ids, configuration.window_size)
    model = FeedForwardNeuralNetwork(configuration)

    print(contexts)
    print(targets)
    print(len(model.embeddings))
    print(len(model.embeddings[0])) 
    print(model.embeddings[0]) 

    print(len(model.hidden_weights))
    print(len(model.hidden_weights[0]))
    print(len(model.hidden_bias))

    print(len(model.output_weights))
    print(len(model.output_weights[0]))
    print(len(model.output_bias))

    input_values = model._get_input([4, 8, 2])

    print(len(input_values))
    print(input_values[:5])

    hidden_values = model._calculate_hidden_layer(input_values)

    print(len(hidden_values))
    print(hidden_values)

    output_scores = model._calculate_output_layer(hidden_values)

    print(len(output_scores))
    print(output_scores)
    print(output_scores.index(max(output_scores)))

    output_scores = model._forward([4, 8, 2])

    predicted_word_id = output_scores.index(max(output_scores))

    print("output scores:", output_scores)
    print("predicted word:", predicted_word_id)

    probabilities = model._softmax(output_scores)

    print("probabilities:", probabilities)
    print("total:", sum(probabilities))
    print("predicted word:", probabilities.index(max(probabilities)))

    predicted_word_id = model.predict_next([4, 8, 2])

    print("predicted next word:", predicted_word_id)

ffnn()