from pathlib import Path


def train_models(ngram, feed_forward, rnn):
    training_dir = Path("training")
    training_dir.mkdir(parents=True, exist_ok=True)

    if ngram is not None:
        ngram_path = training_dir / "ngram.npz"
        if ngram_path.is_file():
            ngram.load(ngram_path)
            print("N-gram model loaded from", ngram_path)
        else:
            ngram.fit()
            ngram.save(ngram_path)
            print("N-gram model trained and saved to", ngram_path)

    if feed_forward is not None:
        ffnn_path = training_dir / "ffnn_model.npz"
        if ffnn_path.is_file():
            feed_forward = feed_forward.load(ffnn_path)
            print("FFNN loaded from", ffnn_path)
        else:
            feed_forward.fit(epochs=8, batch_size=32)
            feed_forward.save(ffnn_path)
            print("FFNN trained and saved to", ffnn_path)

    if rnn is not None:
        rnn_path = training_dir / "rnn.npz"
        if rnn_path.is_file():
            rnn.load(rnn_path)
            print("RNN loaded from", rnn_path)
        else:
            rnn.fit()
            rnn.save(rnn_path)
            print("RNN trained and saved to", rnn_path)

    return ngram, feed_forward, rnn
