export default function DiscussionPage() {
  return (
    <main className="flex-1 min-h-screen py-24 px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center">
          <h1 className="font-abril text-5xl md:text-6xl mb-4 text-black">Discussion</h1>
          <p className="text-xl text-gray-600">Analysis, limitations, and future improvements</p>
        </header>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">Why the Methods Performed As They Did</h2>
          <div className="prose max-w-none text-gray-700 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">N-gram: Baseline Simplicity</h3>
              <p>
                The N-gram model serves as a strong baseline because it directly estimates
                conditional probabilities from observed counts. With Kneser-Ney smoothing,
                it handles unseen contexts reasonably well. However, its fundamental
                limitation is the Markov assumption — it cannot capture dependencies
                beyond the fixed (n-1) context window. Data sparsity grows exponentially
                with n, limiting practical order to 3-5.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">FFNN: Distributed Representations</h3>
              <p>
                The feed-forward network learns continuous word embeddings that capture
                semantic similarity — words with similar contexts get similar vectors.
                This enables generalization to unseen n-grams (e.g., "cat" → "dog"
                substitution). The fixed context window is still a bottleneck, but the
                learned representations are more parameter-efficient than count tables.
                Performance gains over N-grams come primarily from this generalization.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">RNN/LSTM: Sequential Memory</h3>
              <p>
                The recurrent architecture maintains a hidden state that theoretically
                summarizes the entire preceding sequence. LSTM gates mitigate the
                vanishing gradient problem, allowing learning of longer-range dependencies
                than fixed-window models. This is crucial for language where subject-verb
                agreement, coreference, and discourse structure span many tokens.
                The sequential nature makes training slower but yields the best perplexity.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">Limitations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                Dataset Limitations
              </h3>
              <ul className="text-red-700 space-y-2 list-disc list-inside text-sm">
                <li>Single domain/corpus — may not generalize</li>
                <li>Vocabulary size limits rare word handling</li>
                <li>No evaluation on out-of-domain text</li>
                <li>Train/val/test from same distribution</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
              <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                Model Limitations
              </h3>
              <ul className="text-yellow-700 space-y-2 list-disc list-inside text-sm">
                <li>No pretrained embeddings (trained from scratch)</li>
                <li>Small model sizes due to compute constraints</li>
                <li>No attention mechanism (pre-Transformer)</li>
                <li>Teacher forcing during training ≠ inference</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                Evaluation Limitations
              </h3>
              <ul className="text-blue-700 space-y-2 list-disc list-inside text-sm">
                <li>Perplexity ≠ human judgment of quality</li>
                <li>No diversity/coherence metrics for generation</li>
                <li>Single random seed (no variance estimates)</li>
                <li>No statistical significance testing</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                Reproducibility
              </h3>
              <ul className="text-purple-700 space-y-2 list-disc list-inside text-sm">
                <li>Hardware not specified</li>
                <li>Exact software versions not pinned</li>
                <li>Random seeds not fully documented</li>
                <li>No public code release (yet)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">Possible Improvements</h2>
          <div className="space-y-4">
            {[
              { priority: "High", title: "Add Transformer / Attention", desc: "Replace RNN with Transformer decoder (GPT-style) for parallel training and better long-range modeling." },
              { priority: "High", title: "Pretrained Embeddings", desc: "Initialize with GloVe/fastText or use pretrained LM (BERT, GPT-2) for transfer learning." },
              { priority: "Medium", title: "Subword Tokenization", desc: "Use BPE/WordPiece to handle OOV words and reduce vocabulary size." },
              { priority: "Medium", title: "Larger Models + More Data", desc: "Scale up hidden dimensions, layers, and training corpus for better perplexity." },
              { priority: "Medium", title: "Better Regularization", desc: "Label smoothing, weight decay, dropout scheduling, gradient noise." },
              { priority: "Low", title: "Beam Search / Sampling", desc: "Evaluate generation quality with diverse decoding strategies (top-k, nucleus)." },
              { priority: "Low", title: "Human Evaluation", desc: "Pairwise comparison or Likert-scale rating of generated continuations." },
              { priority: "Low", title: "Ensemble Methods", desc: "Interpolate N-gram + neural probabilities for best of both worlds." },
            ].map((imp, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  imp.priority === "High" ? "bg-red-100 text-red-700" :
                  imp.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                  "bg-green-100 text-green-700"
                }`}>{imp.priority}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{imp.title}</h3>
                  <p className="text-gray-600 text-sm">{imp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">Conclusion</h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              We compared three approaches to next-word prediction: a statistical N-gram baseline,
              a feed-forward neural network with learned embeddings, and an LSTM recurrent network.
              As expected, the neural models significantly outperformed the N-gram baseline in
              perplexity and accuracy metrics, with the LSTM achieving the best results due to
              its ability to model variable-length context.
            </p>
            <p>
              The progression from N-gram → FFNN → RNN illustrates the core trade-offs in
              language modeling: count-based simplicity vs. learned representations vs. sequential
              memory. While our models are small by modern standards, they demonstrate the
              fundamental principles that scale to today's large language models.
            </p>
            <p>
              Future work should focus on Transformer architectures, pretrained representations,
              and scaling — the path that led from these building blocks to GPT, BERT, and
              contemporary LLMs.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}