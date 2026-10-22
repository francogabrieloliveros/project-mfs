import pprint

from classes.Tokenizer import Tokenizer


def main():
    # Just a test of the tokenizer, this will be removed
    vocab = Tokenizer("dataset/train.txt")
    # train = vocab.encode_file("dataset/train.txt")
    # test = vocab.encode_file("dataset/test.txt")
    # validation = vocab.encode_file("dataset/validation.txt")

    pprint.pprint(vocab.stoi)


if __name__ == "__main__":
    main()
