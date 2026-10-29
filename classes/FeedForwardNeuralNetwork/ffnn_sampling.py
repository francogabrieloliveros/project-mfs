class FFNNSampling:
    def _sample(self, scores, temperature=0.0, top_k=40, blocked_ids=()):
        if temperature < 0 or temperature > 1:
            raise ValueError("temperature must be between 0 and 1")

        if top_k < 1:
            raise ValueError("top_k must be at least 1")

        candidates = []

        for word_id in range(len(scores)):
            if word_id not in blocked_ids:
                candidates.append(word_id)

        if len(candidates) == 0:
            raise ValueError("no candidate available")

        for i in range(len(candidates)):
            for j in range(i + 1, len(candidates)):
                if scores[candidates[j]] > scores[candidates[i]]:
                    temporary = candidates[i]
                    candidates[i] = candidates[j]
                    candidates[j] = temporary

        candidates = candidates[:top_k]

        if temperature == 0:
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

        adjusted_scores = []

        for word_id in candidates:
            adjusted_scores.append(scores[word_id] / temperature)

        probabilities = self._softmax(adjusted_scores)
        random_value = self._random_value(0.0, 1.0)

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