type ModelKey = "ngram" | "ffnn" | "rnn";

const splits = [
  { name: "Training", articles: "600", rows: "36,718" },
  { name: "Validation", articles: "60", rows: "3,769" },
  { name: "Testing", articles: "60", rows: "4,358" },
];

const models: { key: ModelKey; name: string; bar: string; hex: string }[] = [
  { key: "ngram", name: "N-gram", bar: "bg-gray-800", hex: "#1f2937" },
  { key: "ffnn", name: "FFNN", bar: "bg-blue-600", hex: "#2563eb" },
  { key: "rnn", name: "RNN (LSTM)", bar: "bg-purple-600", hex: "#9333ea" },
];

const metrics: {
  label: string;
  better: "lower" | "higher";
  unit: string;
  values: Record<ModelKey, number>;
}[] = [
  {
    label: "Perplexity",
    better: "lower",
    unit: "",
    values: { ngram: 4970.86, ffnn: 3102.25, rnn: 1322.79 },
  },
  {
    label: "Top-1 accuracy",
    better: "higher",
    unit: "%",
    values: { ngram: 5.7196, ffnn: 4.797, rnn: 8.1796 },
  },
  {
    label: "Top-5 accuracy",
    better: "higher",
    unit: "%",
    values: { ngram: 12.1771, ffnn: 11.1931, rnn: 17.4662 },
  },
  {
    label: "Top-10 accuracy",
    better: "higher",
    unit: "%",
    values: { ngram: 16.6667, ffnn: 15.1292, rnn: 23.1242 },
  },
];

const tokenizationRules = [
  "Keep casing",
  "Keep punctuations",
  "Process in-between word punctuations @-@, @,@, @.@",
  "Add <eos> after each paragraph as end of sequence",
  'Ignore headers with "=" at beginning and "=" at end',
  "Words occurring less than 3 times will not be added to the vocabulary and are recognized as <unk>",
];

const testRules = [
  "Generate 3000 random positions within the range of the raw test dataset.",
  "From these random positions, use current + the next 40 words as a test-set sample.",
  "Then, we will have 3000 test items of length 41, where the last word will be the word-to-predict.",
];

const sectionClass =
  "bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8";
const linkClass = "underline text-black";
const codeClass = "bg-gray-100 px-1 rounded";

const fmt = (v: number, unit: string) => `${v.toFixed(2)}${unit}`;

export default function DatasetPage() {
  return (
    <main className="flex-1 min-h-screen py-24 px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center">
          <h1 className="font-abril text-5xl md:text-6xl mb-4 text-black">
            Dataset
          </h1>
          <p className="text-xl text-gray-600">
            Source, pre-processing, and vocabulary
          </p>
        </header>

        <section className={sectionClass}>
          <h2 className="font-abril text-2xl mb-4 text-black">Dataset</h2>
          <div className="text-gray-700 space-y-4">
            <p className="text-justify">
              The{" "}
              <a
                href="https://huggingface.co/datasets/Salesforce/wikitext"
                className={linkClass}
              >
                WikiText
              </a>{" "}
              language modeling dataset, arranged by Merity et al., 2016 and
              uploaded at{" "}
              <a href="https://huggingface.co/" className={linkClass}>
                huggingface.co
              </a>
              , is a collection of over 100 million tokens extracted from the
              set of verified Good and Featured articles on Wikipedia.
            </p>
            <p className="text-justify">
              Specifically, we used the{" "}
              <a
                href="https://huggingface.co/datasets/Salesforce/wikitext"
                className={linkClass}
              >
                WikiText-2-raw-v1
              </a>{" "}
              dataset, a smaller subset of WikiText-103 containing 720 Wikipedia
              articles that retains the original case, punctuation, and numbers.
            </p>
            <p className="text-gray-600">
              License: Creative Commons Attribution-ShareAlike
            </p>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="font-abril text-2xl mb-4 text-black">
            Dataset Splitting
          </h2>
          <p className="text-gray-700 mb-4">
            The initial 720 Wikipedia articles from wikitext-2-raw-v1 already
            came split into 3 categories.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            {splits.map((split) => (
              <div key={split.name} className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-gray-600">{split.name}</p>
                <p className="font-abril text-3xl text-black">
                  {split.articles}
                </p>
                <p className="text-gray-600">articles ({split.rows} rows)</p>
              </div>
            ))}
          </div>
          <p className="text-gray-700">
            For easier access, we prefetched the rows from each split and
            appended all of them to respective{" "}
            <code className={codeClass}>train.txt</code>,{" "}
            <code className={codeClass}>validation.txt</code>, and{" "}
            <code className={codeClass}>test.txt</code> files.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className="font-abril text-2xl mb-4 text-black">Tokenization</h2>
          <p className="text-gray-700 mb-3">
            Rules used for the training vocabulary:
          </p>
          <ul className="text-gray-700 space-y-2 list-disc list-inside">
            {tokenizationRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className={sectionClass}>
          <h2 className="font-abril text-2xl mb-4 text-black">
            Test Set Preparation
          </h2>
          <p className="text-gray-700 mb-3 text-justify">
            Previously, we used the last word of each sequence as the word to
            predict for the test-set. However, this resulted in low scores for
            all models since it was unfair to predict pre-determined last words
            of sequences which are usually extremely specific nouns, verbs, and
            adjectives.
          </p>
          <section className="bg-white/60 backdrop-blur-sm rounded-3xl py-4 px-8">
            <div className="overflow-x-auto">
              <table className="w-full text-base text-left">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-2 pr-4 font-semibold text-gray-800">
                      Metric
                    </th>
                    {models.map((m) => (
                      <th
                        key={m.key}
                        className="py-2 pr-4 font-semibold text-gray-800 text-center"
                      >
                        {m.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((row) => {
                    return (
                      <tr key={row.label} className="border-b border-gray-100">
                        <td className="py-3 pr-4 font-semibold text-gray-800">
                          {row.label} {row.better === "lower" ? "(↓)" : "(↑)"}
                        </td>
                        {models.map((m) => (
                          <td
                            key={m.key}
                            className="py-3 pr-4 text-center font-mono"
                          >
                            <span className="text-gray-600">
                              {fmt(row.values[m.key], row.unit)}
                            </span>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <p className="text-gray-700 mt-3 mb-3 text-justify">
            Observing this problem, we revised the test-set preparation with a
            new approach but still using the same
            <code className={codeClass}>test.txt</code> data.
          </p>
          <ul className="text-gray-700 space-y-2 list-disc list-inside">
            {testRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          <p className="text-gray-700 mt-3 text-justify">
            This randomness added fairness to the tests and improved the
            evaluation scores of all models.{" "}
            <a href="/results" className={linkClass}>
              See results.
            </a>
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className="font-abril text-2xl mb-4 text-black">Vocabulary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="font-abril text-3xl text-black">32,994</p>
              <p className="text-gray-600">
                unique words including{" "}
                <code className={codeClass}>&lt;unk&gt;</code> and{" "}
                <code className={codeClass}>&lt;eos&gt;</code>
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="font-abril text-3xl text-black">600 x 32,994</p>
              <p className="text-gray-600">
                training dimension from 600 Wikipedia articles
              </p>
            </div>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="font-abril text-2xl mb-4 text-black">
            Features & Target
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold roboto mb-2">Input Features</h3>
              <p className="text-gray-700">
                The words before the last word in each sequence, encoded with
                the training vocabulary.
              </p>
            </div>
            <div>
              <h3 className="font-semibold roboto mb-2">Target Variable</h3>
              <p className="text-gray-700">
                The last word of each sequence, a classification over the
                32,994-word vocabulary.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
