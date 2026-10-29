import numpy as np

class FFNNSampling:
    """Candidate filtering and temperature-based token sampling helpers."""

    def _sample(self, scores, temperature=0.0, top_k=40, blocked_ids=()):
        """Choose among the top-k scores and return the choice and candidate probabilities.

        A temperature of zero selects the highest-scoring token. Positive
        temperatures sample from the candidate softmax; blocked IDs are excluded.
        """
        # Reject settings that would make candidate selection invalid.
        if temperature < 0 or temperature > 1:
            raise ValueError("temperature must be between 0 and 1")

        if top_k < 1:
            raise ValueError("top_k must be at least 1")

        # Remove blocked token IDs before choosing the top-scoring candidates.
        candidate_ids = np.arange(len(scores))
        if blocked_ids:
            candidate_ids = candidate_ids[~np.isin(candidate_ids, blocked_ids)]

        if len(candidate_ids) == 0:
            raise ValueError("no candidate available")

        scores = np.asarray(scores)
        # Keep only the top_k available tokens, ordered by descending score.
        order = np.argsort(-scores[candidate_ids], kind="stable")[:top_k]
        candidates = candidate_ids[order].tolist()

        if temperature == 0:
            # Temperature zero means greedy selection of the highest score.
            chosen_id = candidates[0]
            candidate_scores = []

            for word_id in candidates:
                candidate_scores.append(scores[word_id])

            probabilities = self._softmax(candidate_scores)
            candidate_probabilities = []

            for position in range(len(candidates)):
                candidate_probabilities.append(
                    (candidates[position], probabilities[position])
                )

            return (chosen_id, probabilities[0]), candidate_probabilities

        # Positive temperature flattens or sharpens candidate probabilities.
        adjusted_scores = []

        for word_id in candidates:
            adjusted_scores.append(scores[word_id] / temperature)

        probabilities = self._softmax(adjusted_scores)
        random_value = self.sampling_rng.random()

        # Sample from the cumulative candidate probabilities.
        cumulative_probability = 0.0
        chosen_position = len(candidates) - 1

        for position in range(len(candidates)):
            cumulative_probability += probabilities[position]

            if random_value < cumulative_probability:
                chosen_position = position
                break

        chosen_id = candidates[chosen_position]
        chosen_probability = probabilities[chosen_position]

        candidate_probabilities = []

        for position in range(len(candidates)):
            candidate_probabilities.append(
                (candidates[position], probabilities[position])
            )

        return (chosen_id, chosen_probability), candidate_probabilities
