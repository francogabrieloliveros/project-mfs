def run_tests(vocab, ngram, feed_forward, rnn):
    # TODO: Add more for other models
    prompt = "As with its predecessors , Valkyria Chronicles III is a tactical role-playing game where players take control of a military unit and take part in missions against enemy forces . Stories are told through comic"
    prompt_ids_flat = vocab.encode(prompt)
    prompt_ids = vocab.encode(prompt, flat=False)
    print("Prompt: ", prompt, flush=True)

    # RNN
    (next_id, _), _ = rnn.predict_next(
        prompt_ids_flat, temperature=0.75, top_k=20, blocked_ids=[vocab.unk_id]
    )
    generated_ids = rnn.generate(
        prompt_ids_flat,
        max_tokens=50,
        temperature=0.75,
        top_k=20,
        blocked_ids=[vocab.unk_id],
    )
    print("\n__________RNN Prediction__________")
    print("Next Word:", vocab.decode([next_id]))
    print("Next Phrase: ", vocab.decode(generated_ids))
