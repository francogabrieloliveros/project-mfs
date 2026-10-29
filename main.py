from classes.NGramModel import NGramModel
from classes.RecurrentNeuralNetwork import RecurrentNeuralNetwork
from classes.FeedForwardNeuralNetwork.ffnn import FeedForwardNeuralNetwork
from classes.FeedForwardNeuralNetwork.ffnn_configuration import FFNNConfiguration

from src.load_dataset import load_dataset
from src.run_tests import run_tests
from src.train_models import train_models

def main():
    vocab, train, test, validation = load_dataset()

    ngram = NGramModel(vocab, train, n=3)

    ffnn_configuration = FFNNConfiguration(len(vocab))
    feed_forward = FeedForwardNeuralNetwork(train, len(vocab), configuration=ffnn_configuration)
    rnn = RecurrentNeuralNetwork(train, len(vocab))

    ngram, feed_forward, rnn = train_models(ngram, feed_forward, rnn)

    run_tests(vocab, ngram, feed_forward, rnn)


if __name__ == "__main__":
    main()
