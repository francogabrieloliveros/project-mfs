export default function ResultsPage() {
  // TODO: Replace with actual results from your experiments
  const results = {
    ngram: { ppl: 142.3, acc1: 0.284, acc5: 0.491, acc10: 0.587, params: "—", time: 0.8 },
    ffnn: { ppl: 98.7, acc1: 0.352, acc5: 0.583, acc10: 0.689, params: "2.1M", time: 3.2 },
    rnn: { ppl: 87.4, acc1: 0.389, acc5: 0.621, acc10: 0.724, params: "4.8M", time: 12.7 },
  };

  const metricRows = [
    { key: "ppl", label: "Perplexity (↓)", fmt: (v: number) => v.toFixed(1), better: "lower" },
    { key: "acc1", label: "Top-1 Accuracy (↑)", fmt: (v: number) => (v * 100).toFixed(1) + "%", better: "higher" },
    { key: "acc5", label: "Top-5 Accuracy (↑)", fmt: (v: number) => (v * 100).toFixed(1) + "%", better: "higher" },
    { key: "acc10", label: "Top-10 Accuracy (↑)", fmt: (v: number) => (v * 100).toFixed(1) + "%", better: "higher" },
    { key: "params", label: "Parameters", fmt: (v: string) => v, better: "lower" },
    { key: "time", label: "Inference Time (ms, ↓)", fmt: (v: number) => v.toFixed(1), better: "lower" },
  ];

  const getBest = (key: string, better: string) => {
    const vals = Object.entries(results).map(([k, v]) => [k, (v as any)[key]] as const);
    if (better === "lower") return vals.reduce((a, b) => a[1] < b[1] ? a : b)[0];
    return vals.reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  return (
    <main className="flex-1 min-h-screen py-24 px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center">
          <h1 className="font-abril text-5xl md:text-6xl mb-4 text-black">Results</h1>
          <p className="text-xl text-gray-600">Comparison tables and figures across all models</p>
        </header>

        {/* Main Results Table */}
        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8 overflow-x-auto">
          <h2 className="font-abril text-2xl mb-6 text-black">Quantitative Comparison (Test Set)</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="pb-3 font-semibold text-gray-800">Metric</th>
                <th className="pb-3 font-semibold text-gray-800 text-center">N-gram</th>
                <th className="pb-3 font-semibold text-gray-800 text-center">FFNN</th>
                <th className="pb-3 font-semibold text-gray-800 text-center">RNN/LSTM</th>
                <th className="pb-3 font-semibold text-gray-800 text-center">Best</th>
              </tr>
            </thead>
            <tbody>
              {metricRows.map((row) => {
                const bestModel = getBest(row.key, row.better);
                return (
                  <tr key={row.key} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-800">{row.label}</td>
                    <td className="py-3 text-center font-mono">
                      {bestModel === "ngram" ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                          {row.fmt(results.ngram[row.key as keyof typeof results.ngram])}
                        </span>
                      ) : (
                        row.fmt(results.ngram[row.key as keyof typeof results.ngram])
                      )}
                    </td>
                    <td className="py-3 text-center font-mono">
                      {bestModel === "ffnn" ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                          {row.fmt(results.ffnn[row.key as keyof typeof results.ffnn])}
                        </span>
                      ) : (
                        row.fmt(results.ffnn[row.key as keyof typeof results.ffnn])
                      )}
                    </td>
                    <td className="py-3 text-center font-mono">
                      {bestModel === "rnn" ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                          {row.fmt(results.rnn[row.key as keyof typeof results.rnn])}
                        </span>
                      ) : (
                        row.fmt(results.rnn[row.key as keyof typeof results.rnn])
                      )}
                    </td>
                    <td className="py-3 text-center text-green-600 font-semibold">
                      {bestModel.toUpperCase()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-gray-500 text-sm mt-4 text-center">
            Green highlight = best performer. Metrics on test set. Replace placeholder values with actual results.
          </p>
        </section>

        {/* Perplexity Comparison Chart Placeholder */}
        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-6 text-black">Perplexity Comparison</h2>
          <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="font-medium">Bar Chart: Perplexity by Model</p>
              <p className="text-sm">Add Recharts / Chart.js visualization here</p>
            </div>
          </div>
        </section>

        {/* Top-K Accuracy Chart Placeholder */}
        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-6 text-black">Top-K Accuracy Comparison</h2>
          <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="font-medium">Grouped Bar Chart: Top-1/5/10 Accuracy</p>
              <p className="text-sm">Add grouped bar chart visualization here</p>
            </div>
          </div>
        </section>

        {/* Qualitative Examples */}
        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-6 text-black">Qualitative Examples</h2>
          <div className="space-y-6">
            {[
              {
                context: "The quick brown fox jumps over the",
                ngram: "lazy",
                ffnn: "lazy",
                rnn: "lazy",
                target: "lazy",
              },
              {
                context: "Machine learning models require large amounts of",
                ngram: "data",
                ffnn: "data",
                rnn: "training",
                target: "data",
              },
              {
                context: "In natural language processing, the goal is to",
                ngram: "understand",
                ffnn: "process",
                rnn: "understand",
                target: "understand",
              },
            ].map((ex, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <p className="font-mono text-sm text-gray-700 bg-white p-3 rounded-xl border">
                  <span className="font-semibold">Context:</span> "{ex.context}"
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="p-2 bg-white rounded-xl border">
                    <span className="text-gray-500">Target:</span>
                    <span className="font-mono font-semibold ml-1 text-green-700">{ex.target}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border">
                    <span className="text-gray-500">N-gram:</span>
                    <span className="font-mono font-semibold ml-1 {ex.ngram === ex.target ? 'text-green-700' : 'text-red-700'}">{ex.ngram}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border">
                    <span className="text-gray-500">FFNN:</span>
                    <span className="font-mono font-semibold ml-1 {ex.ffnn === ex.target ? 'text-green-700' : 'text-red-700'}">{ex.ffnn}</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border">
                    <span className="text-gray-500">RNN:</span>
                    <span className="font-mono font-semibold ml-1 {ex.rnn === ex.target ? 'text-green-700' : 'text-red-700'}">{ex.rnn}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-4">Replace with actual model predictions from your test set.</p>
        </section>

        {/* Error Analysis Placeholder */}
        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">Error Analysis (Placeholder)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
              <h3 className="font-semibold text-red-800 mb-3">Common N-gram Errors</h3>
              <ul className="text-red-700 space-y-1 list-disc list-inside">
                <li>Unseen n-grams → falls back to lower order</li>
                <li>Cannot capture long-range dependencies</li>
                <li>Over-smoothing common sequences</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-3">Common Neural Errors</h3>
              <ul className="text-blue-700 space-y-1 list-disc list-inside">
                <li>Overconfident wrong predictions</li>
                <li>Repetition loops (RNN)</li>
                <li>Rare word underprediction</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}