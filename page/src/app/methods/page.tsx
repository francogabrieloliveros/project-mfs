export default function MethodsPage() {
  const models = [
    {
      id: "ngram",
      name: "N-gram Language Model",
      type: "Statistical",
      description: "Predicts next word based on frequency counts of n-word sequences in training data. Uses Markov assumption: probability of next word depends only on previous n-1 words.",
      pros: ["Simple, interpretable", "Fast training/inference", "No GPU needed", "Good baseline"],
      cons: ["Data sparsity problem", "Fixed context window", "No generalization to unseen n-grams", "Curse of dimensionality"],
      implementation: "Built with smoothing (Kneser-Ney / Laplace), configurable n (2-5), efficient count storage.",
    },
    {
      id: "ffnn",
      name: "Feed-Forward Neural Network (FFNN)",
      type: "Neural (Fixed Context)",
      description: "Fixed-size context window fed through embedding layer → hidden layers → output softmax over vocabulary. Learns distributed word representations.",
      pros: ["Learns word embeddings", "Generalizes to similar contexts", "Parallelizable training", "Better than n-grams on seen data"],
      cons: ["Fixed context window", "No sequential memory", "Many parameters", "Overfits on small data"],
      implementation: "Embedding dim 128-512, 2-3 hidden layers (ReLU), dropout, Adam optimizer, cross-entropy loss.",
    },
    {
      id: "rnn",
      name: "Recurrent Neural Network (RNN/LSTM/GRU)",
      type: "Neural (Variable Context)",
      description: "Processes sequence step-by-step maintaining hidden state. Can theoretically capture arbitrarily long dependencies. LSTM/GRU gates mitigate vanishing gradients.",
      pros: ["Variable-length context", "Sequential modeling", "Stateful predictions", "Strong on language tasks"],
      cons: ["Sequential training (slow)", "Vanishing/exploding gradients", "Hard to parallelize", "More hyperparameters"],
      implementation: "LSTM/GRU, 1-2 layers, hidden size 256-512, embedding dim 128-512, gradient clipping, teacher forcing.",
    },
  ];

  return (
    <main className="flex-1 min-h-screen py-24 px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center">
          <h1 className="font-abril text-5xl md:text-6xl mb-4 text-black">Methods</h1>
          <p className="text-xl text-gray-600">How each model works and implementation details</p>
        </header>

        {models.map((model) => (
          <section key={model.id} className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h2 className="font-abril text-3xl text-black">{model.name}</h2>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {model.type}
              </span>
            </div>

            <div className="prose max-w-none text-gray-700 mb-6">
              <p>{model.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  Strengths
                </h3>
                <ul className="text-gray-700 space-y-1 list-disc list-inside">
                  {model.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                  Limitations
                </h3>
                <ul className="text-gray-700 space-y-1 list-disc list-inside">
                  {model.cons.map((con, i) => <li key={i}>{con}</li>)}
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Implementation Details</h3>
              <p className="text-gray-700 font-mono text-sm">{model.implementation}</p>
            </div>
          </section>
        ))}

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">Model Comparison Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="pb-2 font-semibold text-gray-800">Aspect</th>
                  <th className="pb-2 font-semibold text-gray-800">N-gram</th>
                  <th className="pb-2 font-semibold text-gray-800">FFNN</th>
                  <th className="pb-2 font-semibold text-gray-800">RNN/LSTM</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-200"><td className="py-2 font-medium">Context Type</td><td>Fixed (n-1)</td><td>Fixed (window)</td><td>Variable (full history)</td></tr>
                <tr className="border-b border-gray-200"><td className="py-2 font-medium">Generalization</td><td>Poor</td><td>Good</td><td>Good</td></tr>
                <tr className="border-b border-gray-200"><td className="py-2 font-medium">Training Speed</td><td>Fastest</td><td>Fast (parallel)</td><td>Slow (sequential)</td></tr>
                <tr className="border-b border-gray-200"><td className="py-2 font-medium">Parameters</td><td>Counts table</td><td>Medium</td><td>High</td></tr>
                <tr><td className="py-2 font-medium">Interpretability</td><td>High</td><td>Low</td><td>Low</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}