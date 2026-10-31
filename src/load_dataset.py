from classes.Tokenizer import Tokenizer


def load_dataset():
    vocab = Tokenizer("dataset/train.txt")
    train = vocab.encode_file("dataset/train.txt")
    test = vocab.encode_file("dataset/test.txt")
    validation = vocab.encode_file("dataset/validation.txt")

    return vocab, train, test, validation
