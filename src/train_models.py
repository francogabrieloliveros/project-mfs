from pathlib import Path


def train_models(ngram, feed_forward, rnn):
    # TODO: Add more for other models
    ngram_path = Path("training/ngram.npz")
    ngram_path.parent.mkdir(exist_ok=True)

    if not ngram_path.is_file():
        ngram.fit()
        ngram.save(ngram_path)
    else:
        ngram.load(ngram_path)


    rnn_path = Path("training/rnn.npz")
    rnn_path.parent.mkdir(exist_ok=True)

    # Train models if not done yet
    if not rnn_path.is_file():
        rnn.fit()
        rnn.save(rnn_path)
    else:
        rnn.load(rnn_path)
