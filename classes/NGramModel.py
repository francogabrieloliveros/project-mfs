import random
import numpy as np


class NGramModel:
    """
    USAGE:
        model = NGramModel(vocab, train, n=3, alpha=0.1)
        model.fit()
        model.save("training/ngram_n3.npz")   # or model.load(path)

        (next_id, prob), candidates = model.predict_next(prompt_ids, top_k=40)
        ids = model.generate(prompt_ids, max_tokens=50, temperature=0.5)
        text = vocab.decode(ids)
    """

    # ----------------------------------------------------------------------------
    # SETUP
    # ----------------------------------------------------------------------------
    def __init__(self, vocab, train=None, n=3, alpha=0.1):
        """Store settings and the training ids used by fit()"""
        self.context_counts = {}
        self.ngram_counts = {}
        self.context_lookup = {}
        self.n = n
        self.alpha = alpha
        self.vocab = vocab
        self.train = train

    # ----------------------------------------------------------------------------
    # TRAINING
    # ----------------------------------------------------------------------------
    def fit(self, train_lines=None):
        """Count n-grams and contexts from the training ids (flat or per line)"""
        if train_lines is None:
            train_lines = self.train

        if len(train_lines) > 0 and not isinstance(train_lines[0], list):
            lines, current = [], []
            for i in train_lines:
                current.append(i)
                if i == self.vocab.eos_id:
                    lines.append(current)
                    current = []
            if current:
                lines.append(current)
            train_lines = lines

        # count current word and next word's occurence (by id)
        for line in train_lines:

            for i in range(len(line) - self.n + 1):
                # get N-gram sequence
                ngram_sequence = line[i:i + self.n]
                # get context sequence
                context_sequence = ngram_sequence[:-1]

                # fill dictionaries and get occurences
                self.ngram_counts[tuple(ngram_sequence)] = self.ngram_counts.get(
                    tuple(ngram_sequence), 0
                ) + 1

                self.context_counts[tuple(context_sequence)] = self.context_counts.get(
                    tuple(context_sequence), 0
                ) + 1

                # fill lookup dictionary for faster processing
                if tuple(context_sequence) not in self.context_lookup:
                    self.context_lookup[tuple(context_sequence)] = {}

                self.context_lookup[tuple(context_sequence)][ngram_sequence[-1]] = self.context_lookup[tuple(context_sequence)].get(
                    ngram_sequence[-1], 0
                ) + 1

    # ----------------------------------------------------------------------------
    # PROBABILITY AND PREDICTION
    # ----------------------------------------------------------------------------
    def get_probability(self, context, word):
        """Add-alpha smoothed P(word | context), where context is a tuple of ids"""
        # add the following word to the context
        complete_gram = list(context) + [word]

        # get smoothed probability of a word given its context
        num = self.ngram_counts.get(tuple(complete_gram), 0) + self.alpha
        den = self.context_counts.get(tuple(context), 0) + (self.alpha * len(self.vocab.stoi))

        p = num / den
        return p

    def _candidates(self, context, top_k=40, blocked_ids=None):
        """Top-k (id, probability) pairs that follow the context, high to low"""
        # get candidate ids
        targets = self.context_lookup.get(tuple(context), {})

        if not targets:
            return []

        # generate tuples of (id, probability) from the ids
        candidates = []
        for target in targets:

            if blocked_ids and target in blocked_ids:
                continue

            p = self.get_probability(context, target)
            candidates.append((target, p))

        sorted_cands = sorted(candidates, key=lambda x : x[1], reverse=True)
        return sorted_cands[:top_k]

    def predict_next(self, context, temperature=0.0, top_k=40, blocked_ids=None):
        """
        Next id for the last n-1 ids of the context.
        Returns ((next_id, probability), candidates). If the context was never
        seen in training, returns ((None, 0.0), []).
        """
        assert 0 <= temperature <= 1
        assert len(context) >= self.n - 1, f"Need at least {self.n - 1} ids"

        # get window
        window = tuple(context[-(self.n - 1):])
        # get candidates
        candidates = self._candidates(window, top_k, blocked_ids)

        if not candidates:
            return (None, 0.0), []

        # no temperature, get first candidate
        if temperature == 0:
            chosen = candidates[0]
        # perform weighted selection
        else:
            w = [p ** (1 / temperature) for _, p in candidates]
            chosen = random.choices(candidates, weights=w)[0]

        return chosen, candidates

    def generate(self, context, max_tokens, temperature=0.0, top_k=40, blocked_ids=None):
        """Generate up to max_tokens ids; stops early on an unseen context"""
        assert 0 <= temperature <= 1
        assert max_tokens > 0
        assert len(context) >= self.n - 1

        # find window
        window = list(context[-(self.n - 1):])
        generated = []

        for _ in range(max_tokens):
            # get candidates
            targets = self._candidates(tuple(window), top_k, blocked_ids)

            if not targets:
                break

            # no temperature, get first candidate
            if temperature == 0:
                chosen_id = targets[0][0]

            else:
                w = []
                candidate_ids = []

                # perform weighted selection
                for word_id, probability in targets:

                    weight = probability ** (1 / temperature)
                    candidate_ids.append(word_id)
                    w.append(weight)

                chosen_id = random.choices(candidate_ids, weights=w)[0]

            generated.append(chosen_id)
            # shift the window to the right
            window = window[1:] + [chosen_id]

        return generated

    # ----------------------------------------------------------------------------
    # SAVING/LOADING
    # ----------------------------------------------------------------------------
    def save(self, path):
        """Save the counts to a .npz file"""
        np.savez_compressed(
            path,
            ngram_keys=np.array(list(self.ngram_counts.keys()), dtype=np.int32).reshape(-1, self.n),
            ngram_values=np.array(list(self.ngram_counts.values()), dtype=np.int64),
            context_keys=np.array(list(self.context_counts.keys()), dtype=np.int32).reshape(-1, self.n - 1),
            context_values=np.array(list(self.context_counts.values()), dtype=np.int64),
            n=self.n,
            alpha=self.alpha,
            vocab_size=len(self.vocab),
        )

    def load(self, path):
        """Load the counts from a .npz file made by save()"""
        print(f"Loading weights and saved data from {path}.")
        data = np.load(path)

        # a different vocab would scramble the ids
        if int(data["vocab_size"]) != len(self.vocab):
            raise ValueError("Vocab size does not match the saved model")

        self.n = int(data["n"])
        self.alpha = float(data["alpha"])

        # convert to list to match tuple keys 
        self.ngram_counts = {}
        for key, count in zip(data["ngram_keys"].tolist(), data["ngram_values"].tolist()):
            self.ngram_counts[tuple(key)] = count

        self.context_counts = {}
        for key, count in zip(data["context_keys"].tolist(), data["context_values"].tolist()):
            self.context_counts[tuple(key)] = count

        # rebuild the lookup then assign the count
        self.context_lookup = {}
        for ngram, count in self.ngram_counts.items():
            context = ngram[:-1]
            if context not in self.context_lookup:
                self.context_lookup[context] = {}
            self.context_lookup[context][ngram[-1]] = count
