type ModelKey = "ngram" | "ffnn" | "rnn";

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
    values: { ngram: 898.4069944465869, ffnn: 247.78562683986024, rnn: 165.467388034928 },
  },
  {
    label: "Top-1 accuracy",
    better: "higher",
    unit: "%",
    values: { ngram: 17.7, ffnn: 20.233333333333334, rnn: 22.9 },
  },
  {
    label: "Top-5 accuracy",
    better: "higher",
    unit: "%",
    values: { ngram: 36.46666666666667, ffnn: 39.46666666666667, rnn: 43.3 },
  },
  {
    label: "Top-10 accuracy",
    better: "higher",
    unit: "%",
    values: { ngram: 44.26666666666667, ffnn: 46.96666666666667, rnn: 50.66666666666667 },
  },
];

const accuracyMetrics = metrics.filter((m) => m.unit === "%");
const AXIS_MAX = 60; // % — top of the bar scale

function bestModel(m: (typeof metrics)[number]): ModelKey {
  const entries = Object.entries(m.values) as [ModelKey, number][];
  return entries.reduce((a, b) =>
    (m.better === "lower" ? b[1] < a[1] : b[1] > a[1]) ? b : a,
  )[0];
}

const fmt = (v: number, unit: string) => `${v.toFixed(2)}${unit}`;

// Perplexity bars
const perplexity = metrics[0];
const PPL_MAX = 1000;

// One sample run of run_demo.py
const samples: { model: string; next: string; sequence: string }[] = [
  {
    model: "N-gram",
    next: "to",
    sequence: `"The first of the time , and the series of the city , and the other countries , a major roads and a total syntheses including the end of the first down the first season . He is the end of the game . <eos>`,
  },
  {
    model: "FFNN",
    next: "was",
    sequence: `that year a range of the series . In the case of Alkan 's brother , who is not common in some sets .`,
  },
  {
    model: "RNN (LSTM)",
    next: "was",
    sequence: `was released on October 1 , 2006 . <eos> All of the first half of the series , the show was released in the first week of 2010 . <eos> The album 's third single , " The Wave " is the best single from the album . <eos>`,
  },
];

export default function ResultsPage() {
  return (
    <main className="flex-1 min-h-screen py-24 px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="font-abril text-5xl md:text-6xl mb-4 text-black">
            Results
          </h1>
          <p className="text-xl text-gray-600">
            Test-set comparison of all three models
          </p>
        </header>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">Comparison</h2>
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
                  const best = bestModel(row);
                  return (
                    <tr key={row.label} className="border-b border-gray-100">
                      <td className="py-3 pr-4 font-semibold text-gray-800">
                        {row.label} {row.better === "lower" ? "(↓)" : "(↑)"}
                      </td>
                      {models.map((m) => (
                        <td key={m.key} className="py-3 pr-4 text-center font-mono">
                          {best === m.key ? (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                              {fmt(row.values[m.key], row.unit)}
                            </span>
                          ) : (
                            <span className="text-gray-600">
                              {fmt(row.values[m.key], row.unit)}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 text-base mt-4">
            Green marks the best model per metric. All runs use temperature 0;
            top-k accuracy uses k = 1, 5, and 10. The N-gram model uses n = 2.
            Perplexity is computed from one prediction per test sequence.
          </p>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">
            Top-k Accuracy
          </h2>
          <div className="flex flex-wrap gap-4 text-base text-gray-700 mb-6">
            {models.map((m) => (
              <span key={m.key} className="flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded ${m.bar}`} />
                {m.name}
              </span>
            ))}
          </div>
          <div className="space-y-6">
            {accuracyMetrics.map((row) => (
              <div key={row.label}>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {row.label.replace(" accuracy", "")}
                </h3>
                <div className="space-y-1.5">
                  {models.map((m) => (
                    <div key={m.key} className="flex items-center gap-3">
                      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${m.bar}`}
                          style={{
                            width: `${(row.values[m.key] / AXIS_MAX) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="w-20 text-right text-base font-mono text-gray-700">
                        {fmt(row.values[m.key], "%")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">Perplexity</h2>
          <p className="text-gray-600 text-base mb-4">Lower is better.</p>
          <div className="space-y-1.5">
            {models.map((m) => (
              <div key={m.key} className="flex items-center gap-3">
                <span className="w-28 text-base text-gray-700">{m.name}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${m.bar}`}
                    style={{
                      width: `${(perplexity.values[m.key] / PPL_MAX) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-20 text-right text-base font-mono text-gray-700">
                  {fmt(perplexity.values[m.key], "")}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">
            Text Generation Demo
          </h2>
          <p className="text-gray-600 text-base mb-2">
            All three models continue the same prompt:
          </p>
          <p className="font-mono text-base text-gray-700 bg-gray-50 p-3 rounded-xl border mb-4">
            Kiss You is a song recorded by English - Irish boy band One
            Direction for their second studio album , Take Me Home ( 2012 ) . It
            was released as the record &apos;s second single in Germany and the
            third overall single on 7 January 2013 . The song
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-base">
            {[
              ["Temperature", "N-gram 0.60 · FFNN 0.80 · RNN 0.65"],
              ["Top-k", "20"],
              ["Max new tokens", "50"],
              ["Blocked token", "<unk>"],
            ].map(([label, value]) => (
              <div key={label} className="bg-gray-50 p-3 rounded-xl">
                <strong>{label}:</strong> {value}
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-gray-800 mt-6 mb-3">Sample run</h3>
          <div className="space-y-3">
            {samples.map((s) => (
              <div key={s.model} className="p-4 bg-gray-50 rounded-2xl">
                <h4 className="font-semibold text-gray-800">{s.model}</h4>
                <p className="text-base text-gray-700 mt-1">
                  <span className="text-gray-500">Next word:</span>{" "}
                  <span className="font-mono font-semibold">{s.next}</span>
                </p>
                <p className="text-base text-gray-700 mt-1">
                  <span className="text-gray-500">Next sequence:</span>{" "}
                  <span className="font-mono">{s.sequence}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
