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

const accuracyMetrics = metrics.filter((m) => m.unit === "%");
const AXIS_MAX = 25; // % — top of the bar scale

function bestModel(m: (typeof metrics)[number]): ModelKey {
  const entries = Object.entries(m.values) as [ModelKey, number][];
  return entries.reduce((a, b) =>
    (m.better === "lower" ? b[1] < a[1] : b[1] > a[1]) ? b : a,
  )[0];
}

const fmt = (v: number, unit: string) => `${v.toFixed(2)}${unit}`;

// Line chart geometry (SVG units)
const CHART = { w: 600, h: 300, left: 48, right: 24, top: 36, bottom: 44 };
const KS = [1, 5, 10]; // matches the order of accuracyMetrics
const GRID = [0, 5, 10, 15, 20, 25];
const xFor = (k: number) =>
  CHART.left + ((k - 1) / 9) * (CHART.w - CHART.left - CHART.right);
const yFor = (v: number) =>
  CHART.top + (1 - v / AXIS_MAX) * (CHART.h - CHART.top - CHART.bottom);

// Perplexity charts
const perplexity = metrics[0];
const PPL_MAX = 5000;
const PPL_GRID = [0, 1000, 2000, 3000, 4000, 5000];
const xForModel = (i: number) =>
  CHART.left + ((i + 0.5) / models.length) * (CHART.w - CHART.left - CHART.right);
const yForPpl = (v: number) =>
  CHART.top + (1 - v / PPL_MAX) * (CHART.h - CHART.top - CHART.bottom);

// One sample run of run_demo.py
const samples: { model: string; next: string; sequence: string }[] = [
  {
    model: "N-gram",
    next: "to",
    sequence: `" The first of the time , and the series of the city , and the other countries , a major roads and a total syntheses including the end of the first down the first season . He is the end of the game . <eos>`,
  },
  {
    model: "FFNN",
    next: "was",
    sequence: `received the music of the species 's work . The common starling is also common starling . The common starling may be considered by the common starling ( Op. 39 ) ( 23 % ) , and the other common starling are to be known as of whom they can`,
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
            top-k accuracy uses k = 1, 5, and 10. Perplexity is computed from
            one prediction per test sequence.
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
            Accuracy vs. k
          </h2>
          <div className="flex flex-wrap gap-4 text-base text-gray-700 mb-4">
            {models.map((m) => (
              <span key={m.key} className="flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded ${m.bar}`} />
                {m.name}
              </span>
            ))}
          </div>
          <svg
            viewBox={`0 0 ${CHART.w} ${CHART.h}`}
            className="w-full h-auto"
            role="img"
            aria-label="Top-k accuracy at k = 1, 5, and 10 for each model"
          >
            {GRID.map((g) => (
              <g key={g}>
                <line
                  x1={CHART.left}
                  x2={CHART.w - CHART.right}
                  y1={yFor(g)}
                  y2={yFor(g)}
                  stroke="#e5e7eb"
                />
                <text
                  x={CHART.left - 8}
                  y={yFor(g) + 4}
                  textAnchor="end"
                  fontSize="14"
                  fill="#6b7280"
                >
                  {g}%
                </text>
              </g>
            ))}
            {KS.map((k) => (
              <text
                key={k}
                x={xFor(k)}
                y={CHART.h - CHART.bottom + 24}
                textAnchor="middle"
                fontSize="14"
                fill="#6b7280"
              >
                k = {k}
              </text>
            ))}
            {models.map((m) => {
              const pts = accuracyMetrics.map((row, i) => ({
                x: xFor(KS[i]),
                y: yFor(row.values[m.key]),
              }));
              return (
                <g key={m.key}>
                  <polyline
                    points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke={m.hex}
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {pts.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="4.5" fill={m.hex} />
                  ))}
                </g>
              );
            })}
          </svg>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">
            Perplexity by Model
          </h2>
          <svg
            viewBox={`0 0 ${CHART.w} ${CHART.h}`}
            className="w-full h-auto"
            role="img"
            aria-label="Perplexity for each model"
          >
            {PPL_GRID.map((g) => (
              <g key={g}>
                <line
                  x1={CHART.left}
                  x2={CHART.w - CHART.right}
                  y1={yForPpl(g)}
                  y2={yForPpl(g)}
                  stroke="#e5e7eb"
                />
                <text
                  x={CHART.left - 8}
                  y={yForPpl(g) + 4}
                  textAnchor="end"
                  fontSize="14"
                  fill="#6b7280"
                >
                  {g}
                </text>
              </g>
            ))}
            {models.map((m, i) => (
              <text
                key={m.key}
                x={xForModel(i)}
                y={CHART.h - CHART.bottom + 24}
                textAnchor="middle"
                fontSize="14"
                fill="#6b7280"
              >
                {m.name}
              </text>
            ))}
            <polyline
              points={models
                .map(
                  (m, i) =>
                    `${xForModel(i)},${yForPpl(perplexity.values[m.key])}`,
                )
                .join(" ")}
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {models.map((m, i) => (
              <g key={m.key}>
                <circle
                  cx={xForModel(i)}
                  cy={yForPpl(perplexity.values[m.key])}
                  r="5"
                  fill={m.hex}
                />
                <text
                  x={xForModel(i)}
                  y={yForPpl(perplexity.values[m.key]) - 12}
                  textAnchor="middle"
                  fontSize="14"
                  fill="#374151"
                >
                  {fmt(perplexity.values[m.key], "")}
                </text>
              </g>
            ))}
          </svg>
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
              ["Temperature", "0.75"],
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
