import math

from tqdm import tqdm


def get_topk_accuracy(tops):
    return sum(tops) / len(tops)


def get_perplexity(logs):
    return math.exp(-sum(logs) / len(logs))


def run_test(vocab, test, ngram, feed_forward, rnn):
    print("\n\nRunning evaluations...")

    ngram_log, ngram_top_1, ngram_top_5, ngram_top_10 = [], [], [], []
    ffnn_log, ffnn_top_1, ffnn_top_5, ffnn_top_10 = [], [], [], []
    rnn_log, rnn_top_1, rnn_top_5, rnn_top_10 = [], [], [], []

    for query in tqdm(test, desc="Query"):
        correct_next = query[-1]
        test_query = query[:-1]

        if ngram is not None:
            n_ctx = ngram.n - 1
            context = tuple(int(i) for i in test_query[-n_ctx:])

            ngram_log.append(math.log(ngram.get_probability(context, correct_next)))

            (_, _), cands = ngram.predict_next(
                context, temperature=0, top_k=1, blocked_ids=[]
            )
            ngram_top_1.append(1 if int(correct_next) in dict(cands) else 0)

            (_, _), cands = ngram.predict_next(
                context, temperature=0, top_k=5, blocked_ids=[]
            )
            ngram_top_5.append(1 if int(correct_next) in dict(cands) else 0)

            (_, _), cands = ngram.predict_next(
                context, temperature=0, top_k=10, blocked_ids=[]
            )
            ngram_top_10.append(1 if int(correct_next) in dict(cands) else 0)

        if feed_forward is not None:
            context_size = feed_forward.configuration.window_size
            context = test_query[-context_size:]

            (_, _), scores = feed_forward.predict_next(
                context,
                temperature=0,
                top_k=len(vocab),
                blocked_ids=(),
            )

            all_scores = dict(scores)

            ffnn_log.append(math.log(all_scores[correct_next]))
            ffnn_top_1.append(1 if correct_next in dict(scores[:1]) else 0)
            ffnn_top_5.append(1 if correct_next in dict(scores[:5]) else 0)
            ffnn_top_10.append(1 if correct_next in dict(scores[:10]) else 0)

        if rnn is not None:
            (_, _), scores = rnn.predict_next(
                test_query,
                temperature=0.0,
                top_k=len(vocab),  # Return score for all words
                blocked_ids=[],
            )

            scores_map = dict(scores)

            rnn_log.append(math.log(scores_map[correct_next]))
            rnn_top_1.append(1 if correct_next in dict(scores[:1]) else 0)
            rnn_top_5.append(1 if correct_next in dict(scores[:5]) else 0)
            rnn_top_10.append(1 if correct_next in dict(scores[:10]) else 0)

    if ngram is not None:
        print("\n__________N-Gram Evaluation__________", flush=True)
        print(f"n: {ngram.n}")
        print(f"Perplexity Score: {get_perplexity(ngram_log)}")
        print(f"Top-1 Accuracy: {get_topk_accuracy(ngram_top_1)}")
        print(f"Top-5 Accuracy: {get_topk_accuracy(ngram_top_5)}")
        print(f"Top-10 Accuracy: {get_topk_accuracy(ngram_top_10)}")

    if feed_forward is not None:
        print("\n__________FFNN Evaluation__________", flush=True)
        print(f"Perplexity Score: {get_perplexity(ffnn_log)}")
        print(f"Top-1 Accuracy: {get_topk_accuracy(ffnn_top_1)}")
        print(f"Top-5 Accuracy: {get_topk_accuracy(ffnn_top_5)}")
        print(f"Top-10 Accuracy: {get_topk_accuracy(ffnn_top_10)}")

    if rnn is not None:
        print("\n__________RNN Evaluation__________", flush=True)
        print(f"Perplexity Score: {get_perplexity(rnn_log)}")
        print(f"Top-1 Accuracy: {get_topk_accuracy(rnn_top_1)}")
        print(f"Top-5 Accuracy: {get_topk_accuracy(rnn_top_5)}")
        print(f"Top-10 Accuracy: {get_topk_accuracy(rnn_top_10)}")
