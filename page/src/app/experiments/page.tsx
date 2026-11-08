export default function ExperimentsPage() {
  return (
    <main className="flex-1 min-h-screen py-24 px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center">
          <h1 className="font-abril text-5xl md:text-6xl mb-4 text-black">
            Experimental Setup
          </h1>
          <p className="text-xl text-gray-600">
            Data splits, evaluation metrics, and hyperparameters
          </p>
        </header>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">Data Splits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <h3 className="font-abril text-xl text-blue-800 mb-2">
                Training Set
              </h3>
              <p className="font-abril text-4xl text-blue-700">70%</p>
              <p className="text-blue-600 mt-2">Used for model fitting</p>
            </div>
            <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
              <h3 className="font-abril text-xl text-yellow-800 mb-2">
                Validation Set
              </h3>
              <p className="font-abril text-4xl text-yellow-700">15%</p>
              <p className="text-yellow-600 mt-2">Hyperparameter tuning</p>
            </div>
            <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
              <h3 className="font-abril text-xl text-green-800 mb-2">
                Test Set
              </h3>
              <p className="font-abril text-4xl text-green-700">15%</p>
              <p className="text-green-600 mt-2">Final evaluation</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-4">
            Split performed at sequence level (not token level) to prevent data
            leakage. Temporal ordering preserved for language modeling.
          </p>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">
            Evaluation Metrics
          </h2>
          <div className="space-y-4">
            {[
              {
                name: "Perplexity (PPL)",
                desc: "Exponentiated cross-entropy loss. Lower is better. Standard LM metric.",
              },
              {
                name: "Top-1 Accuracy",
                desc: "Fraction of predictions where the top-ranked token matches ground truth.",
              },
              {
                name: "Top-5 Accuracy",
                desc: "Fraction where ground truth is in top 5 predictions.",
              },
              {
                name: "Top-10 Accuracy",
                desc: "Fraction where ground truth is in top 10 predictions.",
              },
              {
                name: "Inference Time",
                desc: "Average milliseconds per prediction (batch size 1).",
              },
              {
                name: "Model Size",
                desc: "Number of trainable parameters / disk footprint.",
              },
            ].map((metric, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
              >
                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-abril text-lg">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{metric.name}</h3>
                  <p className="text-gray-600 text-sm">{metric.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">
            Hyperparameters
          </h2>

          <div className="space-y-8">
            {/* N-gram */}
            <div>
              <h3 className="font-abril text-xl mb-3 text-black flex items-center gap-2">
                <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs">
                  N-gram
                </span>
                N-gram Model
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>N (order):</strong> 3 (trigram)
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Smoothing:</strong> Kneser-Ney
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Vocab threshold:</strong> min_freq=2
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>UNK handling:</strong> Replace rare tokens
                </div>
              </div>
            </div>

            {/* FFNN */}
            <div>
              <h3 className="font-abril text-xl mb-3 text-black flex items-center gap-2">
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  FFNN
                </span>
                Feed-Forward Neural Network
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Context window:</strong> 5 tokens
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Embedding dim:</strong> 256
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Hidden layers:</strong> 2 × 512 (ReLU)
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Dropout:</strong> 0.3
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Optimizer:</strong> Adam (lr=1e-3)
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Batch size:</strong> 128
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Epochs:</strong> 20 (early stopping)
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Loss:</strong> Cross-entropy
                </div>
              </div>
            </div>

            {/* RNN */}
            <div>
              <h3 className="font-abril text-xl mb-3 text-black flex items-center gap-2">
                <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                  RNN
                </span>
                LSTM / GRU
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Cell type:</strong> LSTM (2-layer)
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Hidden size:</strong> 512
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Embedding dim:</strong> 256
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Dropout:</strong> 0.3 (between layers)
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Optimizer:</strong> Adam (lr=1e-3)
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Batch size:</strong> 64
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Seq length:</strong> 35 (BPTT)
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <strong>Grad clip:</strong> 1.0
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">
            Training Details
          </h2>
          <ul className="text-gray-700 space-y-2 list-disc list-inside">
            <li>All models trained on same train/val/test splits</li>
            <li>
              Validation perplexity monitored for early stopping (patience=3)
            </li>
            <li>Best checkpoint saved by validation PPL</li>
            <li>Final test evaluation on held-out test set only</li>
            <li>Random seeds fixed for reproducibility</li>
            <li>Hardware: </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
