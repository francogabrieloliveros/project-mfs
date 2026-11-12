import math

from tqdm import tqdm


def get_topk_accuracy(tops):
    return sum(tops) / len(tops)


def get_perplexity(logs):
    return math.exp(-sum(logs) / len(logs))


def run_test(vocab, test, ngram, feed_forward, rnn, top_k=40):
    print("\n\nRunning evaluations...")
    blocked_ids = [vocab.unk_id]

    ngram_log = []
    ngram_top = []
    ffnn_log = []
    ffnn_top = []
    rnn_log = []
    rnn_top = []

    for query in tqdm(test, desc="Query"):
        correct_next = query[-1]
        test_query = query[:-1]

        if ngram is not None:
            pass

        if feed_forward is not None:
            context_size = feed_forward.configuration.window_size
            context = test_query[-context_size:]

            (_, _), scores = feed_forward.predict_next(
                context,
                temperature=1.0,
                top_k=len(vocab),
                blocked_ids=(),
            )

            all_scores = dict(scores)
            top_scores = dict(scores[:top_k])

            ffnn_log.append(math.log(all_scores[correct_next]))
            ffnn_top.append(1 if correct_next in top_scores else 0)

        if rnn is not None:
            (_, _), scores = rnn.predict_next(
                test_query,
                temperature=0.0,
                top_k=len(vocab),  # Return score for all words
                blocked_ids=blocked_ids,
            )

            scores_map = dict(scores)
            top_map = dict(scores[:top_k])

            rnn_log.append(math.log(scores_map[correct_next]))
            rnn_top.append(1 if correct_next in top_map else 0)

    print("\n__________N-Gram Evaluation__________", flush=True)

    print("\n__________FFNN Evaluation__________", flush=True)
    print(f"Perplexity Score: {get_perplexity(ffnn_log)}")
    print(f"Top-k Accuracy: {get_topk_accuracy(ffnn_top)}")

    print("\n__________RNN Evaluation__________", flush=True)
    print(f"Perplexity Score: {get_perplexity(rnn_log)}")
    print(f"Top-k Accuracy: {get_topk_accuracy(rnn_top)}")
