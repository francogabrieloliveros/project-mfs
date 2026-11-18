const DATASET = "WikiText-2 (raw, v1), using its standard train / validation / test files.";

const models = ["N-gram", "FFNN", "RNN (LSTM)"];

const hyperparameters: { label: string; values: string[] }[] = [
  { label: "Context", values: ["Previous 1 token (n = 2)", "Previous 7 tokens", "Full prompt"] },
  { label: "Embedding dim", values: ["–", "16", "64"] },
  { label: "Hidden units", values: ["–", "32", "128"] },
  { label: "Smoothing", values: ["Add-α, α = 0.1", "–", "–"] },
  { label: "Learning rate", values: ["–", "0.1", "1.0 (×0.6 per epoch from epoch 5)"] },
  { label: "Epochs", values: ["–", "8", "15"] },
  { label: "Batch size", values: ["–", "64", "64"] },
  { label: "BPTT length", values: ["–", "–", "32"] },
  { label: "Gradient clipping", values: ["–", "–", "5.0 (global norm)"] },
];

// Small typesetting helpers for the metric formulas
const Frac = ({ n, d }: { n: string; d: string }) => (
  <span className="inline-flex flex-col items-center align-middle mx-1 text-center leading-tight">
    <span className="border-b border-current px-1">{n}</span>
    <span className="px-1">{d}</span>
  </span>
);

const Sum = ({ small = false }: { small?: boolean }) => (
  <span className="inline-flex flex-col items-center align-middle mx-1 leading-none">
    <span className="text-xs">N</span>
    <span className={small ? "text-2xl" : "text-4xl"}>∑</span>
    <span className="text-xs">i=1</span>
  </span>
);

export default function ExperimentsPage() {
  return (
    <main className="flex-1 min-h-screen py-24 px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="font-abril text-5xl md:text-6xl mb-4 text-black">
            Experimental Setup
          </h1>
          <p className="text-xl text-gray-600">
            Data, metrics, and hyperparameters
          </p>
        </header>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">Data</h2>
          <p className="text-gray-700 mb-4">{DATASET}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ["Train", "Fits the models and builds the vocabulary."],
              ["Validation", "Used for tuning the parameters."],
              ["Test", "Final evaluation only."],
            ].map(([name, desc]) => (
              <div key={name} className="p-4 bg-gray-50 rounded-2xl">
                <h3 className="font-semibold text-gray-800">{name}</h3>
                <p className="text-gray-600 text-base">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">Metrics</h2>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <h3 className="font-semibold text-gray-800">Perplexity</h3>
              <p className="text-gray-600 text-base">
                Exponentiated cross-entropy: the exp of the mean negative
                log-probability the model gives the true next word. Lower is
                better.
              </p>
              <div className="overflow-x-auto">
                <p className="font-serif text-2xl text-gray-800 text-center whitespace-nowrap py-6">
                  Perplexity = e<sup>H(P,Q)</sup> = e
                  <span className="relative -top-4 text-xl">
                    −<Frac n="1" d="N" />
                    <Sum small /> log q(<i>w</i>
                    <sub>
                      <i>i</i>
                    </sub>
                    )
                  </span>
                </p>
              </div>
              <p className="text-gray-500 text-base">
                N is the number of test sequences and q(w<sub>i</sub>) is the
                probability the model assigns to the true word.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl">
              <h3 className="font-semibold text-gray-800">
                Top-1 / Top-5 / Top-10 accuracy
              </h3>
              <p className="text-gray-600 text-base">
                How often the true next word is among the model&apos;s k
                highest-ranked predictions. The indicator is 1 if it is and 0 if
                not, averaged over all test sequences. Higher is better.
              </p>
              <div className="overflow-x-auto">
                <p className="font-serif text-2xl text-gray-800 text-center whitespace-nowrap py-4">
                  Top-<i>k</i> Accuracy = <Frac n="1" d="N" />
                  <Sum /> 𝕀(rank(<i>w</i>
                  <sub>
                    <i>i</i>
                  </sub>
                  ) ≤ <i>k</i>)
                </p>
              </div>
              <p className="text-gray-500 text-base">
                rank(w<sub>i</sub>) is the position of the true word in the
                model&apos;s ranked predictions.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">
            Hyperparameters
          </h2>
          <p className="text-gray-600 text-base mb-4">
            Each model&apos;s parameters were tuned by experimenting with
            different values, and the table lists the final settings that gave
            the best evaluation scores for that model.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-base text-left">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2 pr-4 font-semibold text-gray-800"></th>
                  {models.map((m) => (
                    <th key={m} className="py-2 pr-4 font-semibold text-gray-800">
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hyperparameters.map((row) => (
                  <tr key={row.label} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-semibold text-gray-800">
                      {row.label}
                    </td>
                    {row.values.map((v, i) => (
                      <td key={i} className="py-2 pr-4 text-gray-600">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
