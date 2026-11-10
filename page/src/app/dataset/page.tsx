const splits = [
  { name: "Training", articles: "600", rows: "36,718" },
  { name: "Validation", articles: "60", rows: "3,769" },
  { name: "Testing", articles: "60", rows: "4,358" },
];

const tokenizationRules = [
  "Keep casing",
  "Keep quotations",
  "Process in-between word quotations @-@, @,@, @.@",
  "Add <eos> after each paragraph as end of sequence",
  'Ignore headers with "=" at beginning and "=" at end',
  "Words occurring less than 3 times will not be added to the vocabulary and are recognized as <unk>",
];

const testRules = [
  "Each sequence was placed into their respective arrays (split by <eos>)",
  "Sequences with length < 50 words were removed (there are lines that do not make a full sentence, e.g. sports table data)",
  "All suffix punctuation marks were removed. This ensures the last word in each sequence is the word to predict in training",
];

const sectionClass =
  "bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8";
const linkClass = "underline text-black";
const codeClass = "bg-gray-100 px-1 rounded";

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
            <p>
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
            <p>
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
          <p className="text-gray-700 mb-3">
            The data from <code className={codeClass}>test.txt</code> was
            encoded using the training vocabulary and processed with these
            rules:
          </p>
          <ul className="text-gray-700 space-y-2 list-disc list-inside">
            {testRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className={sectionClass}>
          <h2 className="font-abril text-2xl mb-4 text-black">Vocabulary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="font-abril text-3xl text-black">33,789</p>
              <p className="text-gray-600">
                unique words including{" "}
                <code className={codeClass}>&lt;unk&gt;</code> and{" "}
                <code className={codeClass}>&lt;eos&gt;</code>
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="font-abril text-3xl text-black">600 x 33,789</p>
              <p className="text-gray-600">
                training dimension from 600 Wikipedia articles
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
