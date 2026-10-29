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
from ffnn_sampling import FFNNSampling
from ffnn_forward import FFNNForward

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
            output_scores = self._forward(current_context)

            (next_word_id, next_word_probability), candidates = self._sample(
                output_scores,
                temperature,
                top_k,
                blocked_ids
            )

            generated_ids.append(next_word_id)

            current_context = current_context[1:]
            current_context.append(next_word_id)

        return generated_ids

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
    
    output_scores = model._forward([4, 8, 2])

    print(model._sample(output_scores, temperature=0.0, top_k=5))
    print(model._sample(output_scores, temperature=0.7, top_k=5))

    context = [4, 8, 2]

    generated_ids = model.generate(
        context,
        max_tokens=3,
        temperature=0.0,
        top_k=5
    )

    print("original context:", context)
    print("generated ids:", generated_ids)

    result, candidates = model.predict_next(
        [4, 8, 2],
        temperature=0.0,
        top_k=5
    )

    print("prediction:", result)
    print("candidates:", candidates)

ffnn()