def run_demo(vocab, ngram, feed_forward, rnn):
    prompt = "Kiss You is a song recorded by English - Irish boy band One Direction for their second studio album , Take Me Home ( 2012 ) . It was released as the record 's second single in Germany and the third overall single on 7 January 2013 . The song"
    prompt_ids = vocab.encode(prompt)
    blocked_ids = [vocab.unk_id]
    print("\nPrompt:", prompt, flush=True)

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
        (next_id, _), _ = feed_forward.predict_next(
            context,
            temperature=0.75,
            top_k=20,
            blocked_ids=blocked_ids,
        )
        print("Next word:", vocab.decode([next_id]))
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
