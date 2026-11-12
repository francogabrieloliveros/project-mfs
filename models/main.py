from classes.FeedForwardNeuralNetwork.ffnn import FeedForwardNeuralNetwork
from classes.FeedForwardNeuralNetwork.ffnn_configuration import FFNNConfiguration
from classes.NGramModel import NGramModel
from classes.RecurrentNeuralNetwork import RecurrentNeuralNetwork
from src.load_dataset import load_dataset
from src.run_demo import run_demo
from src.run_test import run_test
from src.train_models import train_models


def main():
    vocab, train, test, validation = load_dataset()

    ngram = NGramModel(vocab, train, n=2)

    ffnn_configuration = FFNNConfiguration(len(vocab))
    feed_forward = FeedForwardNeuralNetwork(
        train, len(vocab), configuration=ffnn_configuration
    )
    rnn = RecurrentNeuralNetwork(train, len(vocab))

    ngram, feed_forward, rnn = train_models(ngram, feed_forward, rnn)

    run_demo(vocab, ngram, feed_forward, rnn)
    run_test(vocab, test, ngram, feed_forward, rnn)


if __name__ == "__main__":
    main()
