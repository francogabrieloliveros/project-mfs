from pathlib import Path


def train_models(ngram, feed_forward, rnn):
    # TODO: Add more for other models
    rnn_path = Path("training/rnn.npz")
    rnn_path.parent.mkdir(exist_ok=True)

    # Train models if not done yet
    if not rnn_path.is_file():
        rnn.fit()
        rnn.save(rnn_path)
    else:
        rnn.load(rnn_path)
