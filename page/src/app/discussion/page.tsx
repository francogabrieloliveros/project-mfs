const sectionClass =
  "rounded-3xl border border-gray-200 bg-white/60 p-6 backdrop-blur-sm md:p-8";

const results = [
  { metric: "Perplexity ↓", ngram: "898.41", ffnn: "247.79", rnn: "165.47" },
  { metric: "Top-1 accuracy ↑", ngram: "17.70%", ffnn: "20.23%", rnn: "22.90%" },
  { metric: "Top-5 accuracy ↑", ngram: "36.47%", ffnn: "39.47%", rnn: "43.30%" },
  { metric: "Top-10 accuracy ↑", ngram: "44.27%", ffnn: "46.97%", rnn: "50.67%" },
];

export default function DiscussionPage() {
  return (
    <main className="min-h-screen px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="mb-12 text-center">
          <h1 className="font-abril mb-4 text-5xl text-black md:text-6xl">
            Discussion
          </h1>
          <p className="text-lg text-gray-600">
            What the results show, what limited the models, and what we would
            improve next.
          </p>
        </header>

        <section className={sectionClass}>
          <h2 className="font-abril mb-4 text-2xl text-black">Results at a glance</h2>
          <p className="mb-5 leading-relaxed text-gray-700">
            The RNN (LSTM) performs best on each reported metric, followed by
            the FFNN and then the bigram N-gram. Both neural models improve on
            the count-based baseline, while the LSTM has the lowest perplexity
            and the highest top-k accuracy.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-300 text-gray-700">
                  <th className="py-2 pr-4 font-semibold">Metric</th>
                  <th className="px-3 py-2 text-center font-semibold">N-gram</th>
                  <th className="px-3 py-2 text-center font-semibold">FFNN</th>
                  <th className="px-3 py-2 text-center font-semibold">RNN (LSTM)</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row) => (
                  <tr key={row.metric} className="border-b border-gray-100">
                    <th className="py-3 pr-4 font-medium text-gray-800">
                      {row.metric}
                    </th>
                    <td className="px-3 py-3 text-center text-gray-700">{row.ngram}</td>
                    <td className="px-3 py-3 text-center text-gray-700">{row.ffnn}</td>
                    <td className="px-3 py-3 text-center font-semibold text-gray-900">{row.rnn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            These metrics come from 3,000 sampled test contexts, with one
            next-token prediction scored per context. The N-gram uses the
            previous token, the FFNN uses the previous eight, and the RNN reads
            the full test context.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className="font-abril mb-5 text-2xl text-black">
            Why the methods performed this way
          </h2>
          <div className="space-y-5 text-gray-700">
            <p>
              <strong className="text-gray-900">N-gram:</strong> The bigram
              model estimates next-word probabilities from counts of adjacent
              word pairs. It is simple and interpretable, but uses only the
              immediately previous word; rare or unseen pairs also leave it
              with limited evidence for a good prediction.
            </p>
            <p>
              <strong className="text-gray-900">FFNN:</strong> Learned
              embeddings let the model generalize across related words and
              contexts, which helps it outperform the bigram baseline. Its
              eight-token window is still fixed, so it cannot use information
              outside that window or maintain a running memory of earlier text.
            </p>
            <p>
              <strong className="text-gray-900">RNN (LSTM):</strong> The LSTM
              processes tokens in sequence and carries a gated state forward,
              giving it access to a longer context than the FFNN. This fits the
              task well and corresponds with its stronger test scores, though
              its sequential training is more computationally demanding.
            </p>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="font-abril mb-4 text-2xl text-black">
            Limitations and next steps
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            Our evaluation uses one dataset, WikiText-2, and 3,000 sampled test
            contexts. It scores only the final token in each context, so the
            reported metrics do not describe prediction quality across every
            token in the test set. The tokenizer also maps words occurring
            fewer than three times in training to an unknown token, limiting
            what we can conclude about rare words. Since all splits come from
            the same corpus, these results do not show how well the models
            transfer to a different subject or writing style.
          </p>
          <p className="mb-4 leading-relaxed text-gray-700">
            The models also receive different amounts of context: the bigram
            uses one previous token, the feed-forward network uses eight, and
            the recurrent model processes the 40-token test context. This
            reflects how the models are designed, but means the comparison does
            not isolate architecture alone. We report a single set of scores
            and show sample generations, without measuring variation across
            training runs or using a formal human rating of coherence and
            relevance.
          </p>
          <p className="leading-relaxed text-gray-700">
            Next, we would score every token in held-out sequences and evaluate
            on additional datasets. Repeating training with several random
            seeds would show whether the ranking is stable; comparing models
            under controlled context lengths would help separate the effect of
            architecture from the amount of context. We would also tune model
            settings on validation data, try subword tokenization for rare
            words, and collect human feedback on generated text.
          </p>
        </section>

        <section className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur-sm md:p-8">
          <h2 className="font-abril mb-3 text-2xl text-black">Conclusion</h2>
          <div className="space-y-4 leading-relaxed text-gray-700">
            <p>
              On our sampled WikiText-2 test contexts, the long short-term
              memory recurrent neural network achieved the strongest results:
              perplexity of 165.47 and top-1, top-5, and top-10 accuracies of
              22.90%, 43.30%, and 50.67%. The feed-forward neural network came
              next, while the bigram model had the highest perplexity and
              lowest accuracy. The feed-forward model&apos;s learned embeddings
              helped it improve on word-pair counts, and the recurrent
              network&apos;s sequential state let it use a longer context.
            </p>
            <p>
              These results suggest that richer learned representations and
              access to more context can help next-word prediction, though
              they require more computation and this evaluation does not
              separate those effects completely. Within the data and test setup
              of this project, the long short-term memory recurrent neural
              network was the strongest of the three methods. Broader
              token-level and cross-domain evaluation would be needed to know
              how well this result carries over beyond WikiText-2.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
