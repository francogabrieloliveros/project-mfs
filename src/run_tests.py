def run_tests(vocab, ngram, feed_forward, rnn):
    # prompt = "As with its predecessors , Valkyria Chronicles III is a tactical role-playing game where players take control of a military unit and take part in missions against enemy forces . Stories are told through comic"
    prompt = " Robert Boulter is an English film , television and theatre actor . He had a guest - starring role on the television series The Bill in 2000 . This was followed by a starring role in the play Herons written by Simon Stephens , which was performed in 2001 at the Royal Court"
    prompt_ids = vocab.encode(prompt)
    blocked_ids = [vocab.unk_id]
    print("Prompt:", prompt, flush=True)

    if ngram is not None:
        (next_id, _), _ = ngram.predict_next(
            prompt_ids,
            temperature=0.75,
            top_k=20,
            blocked_ids=blocked_ids,
        )
        generated_ids = ngram.generate(
            prompt_ids,
            max_tokens=50,
            temperature=0.75,
            top_k=20,
            blocked_ids=blocked_ids,
        )
        print("\n__________N-gram Prediction__________")
        if next_id is None:
            print("No prediction: the prompt context was not seen in training.")
        else:
            print("Next word:", vocab.decode([next_id]))
            print("Next phrase:", vocab.decode(generated_ids))

    if feed_forward is not None:
        context = prompt_ids[-feed_forward.configuration.window_size :]
        print("\n__________FFNN Prediction__________", flush=True)
        (next_id, probability), _ = feed_forward.predict_next(
            context,
            temperature=0.75,
            top_k=20,
            blocked_ids=blocked_ids,
        )
        print("Next word:", vocab.decode([next_id]))
        print("Probability:", probability)
        print("Generating FFNN phrase...", flush=True)
        generated_ids = feed_forward.generate(
            context,
            max_tokens=50,
            temperature=0.75,
            top_k=20,
            blocked_ids=blocked_ids,
        )
        print("Next phrase:", vocab.decode(generated_ids))

    if rnn is not None:
        print("\n__________RNN Prediction__________", flush=True)
        (next_id, _), _ = rnn.predict_next(
            prompt_ids,
            temperature=0.75,
            top_k=20,
            blocked_ids=blocked_ids,
        )
        generated_ids = rnn.generate(
            prompt_ids,
            max_tokens=50,
            temperature=0.75,
            top_k=20,
            blocked_ids=blocked_ids,
        )
        print("Next word:", vocab.decode([next_id]))
        print("Next phrase:", vocab.decode(generated_ids))
