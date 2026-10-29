from pathlib import Path

# def train_models(ngram, feed_forward, rnn):
#     # TODO: Add more for other models

#     # Model file paths
#     rnn_path = Path("training/rnn.npz")
#     ffnn_path = Path("training/ffnn_model.json")

#     # Create the training directory if it does not exist
#     rnn_path.parent.mkdir(parents=True, exist_ok=True)

#     # Train or load the FFNN
#     if feed_forward is not None:
#         if not ffnn_path.is_file():
#             feed_forward.fit(epochs=10)
#             feed_forward.save(ffnn_path)
#         else:
#             feed_forward = feed_forward.load(ffnn_path)

#     # Train or load the RNN
#     if not rnn_path.is_file():
#         rnn.fit()
#         rnn.save(rnn_path)
#     else:
#         rnn.load(rnn_path)

#     return ngram, feed_forward, rnn

def train_models(ngram, feed_forward, rnn):
    # TODO: Add more for other models
    rnn_path = Path("training/rnn.npz")
    ffnn_path.parent.mkdir(parents=True, exist_ok=True)

    if feed_forward is not None:
        if ffnn_path.is_file():
            feed_forward = feed_forward.load(ffnn_path)
            print("FFNN loaded from", ffnn_path)
        elif legacy_ffnn_path.is_file():
            feed_forward = feed_forward.load(legacy_ffnn_path)
            feed_forward.save(ffnn_path)
            print("FFNN loaded from", legacy_ffnn_path, "and converted to", ffnn_path)
        else:
            feed_forward.fit(epochs=8)
            feed_forward.save(ffnn_path)
            print("FFNN trained and saved to", ffnn_path)

    if rnn is not None:
        if rnn_path.is_file():
            rnn.load(rnn_path)
            print("RNN loaded from", rnn_path)
        else:
            rnn.fit()
            rnn.save(rnn_path)
            print("RNN trained and saved to", rnn_path)

    return ngram, feed_forward, rnn
