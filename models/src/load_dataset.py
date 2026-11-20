import numpy as np

from classes.Tokenizer import Tokenizer


def load_dataset(mode="random", n_queries=3000, ctx=40):
    vocab = Tokenizer("dataset/train.txt")
    train = vocab.encode_file("dataset/train.txt")
    validation = vocab.encode_file("dataset/validation.txt")

    test_data = np.array(vocab.encode_file("dataset/test.txt"))
    test = []

    if mode == "paragraph":
        eos_indices = np.where(test_data == vocab.eos_id)[0]
        raw_test = np.split(test_data, eos_indices)  # Split by eos/sequences
        raw_test = [
            seq[1:] for seq in raw_test if len(seq) > 50
        ]  # del eos and short seq

        # Make sure each test case doesnt end in punctuation or <unk>
        punctuations = [vocab.unk_id] + vocab.encode(". , ) \" ' ? ! ]")
        for query in raw_test:
            while query[-1] in punctuations:
                query = query[:-1]
            test.append(query)
    elif mode == "random":
        rng = np.random.default_rng(0)  # fixed seed: same queries every run
        positions = rng.integers(ctx, len(test_data), size=n_queries)
        test = [test_data[p - ctx : p + 1] for p in positions]

    return vocab, train, test, validation
