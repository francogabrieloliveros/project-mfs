export default function ReferencesPage() {
  return (
    <main className="flex-1 min-h-screen py-24 px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center">
          <h1 className="font-abril text-5xl md:text-6xl mb-4 text-black">References</h1>
          <p className="text-xl text-gray-600">Citations, disclosures, and links</p>
        </header>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-6 text-black">Academic References</h2>
          <ol className="space-y-4 text-gray-700 text-sm">
            <li>
              <strong>Kneser, R., & Ney, H. (1995).</strong> Improved backing-off for m-gram language
              modeling. <em>ICASSP</em>, 181-184.
            </li>
            <li>
              <strong>Bengio, Y., Ducharme, R., Vincent, P., & Jauvin, C. (2003).</strong> A neural
              probabilistic language model. <em>JMLR</em>, 3, 1137-1155.
            </li>
            <li>
              <strong>Mikolov, T., Karafiát, M., Burget, L., Černocký, J., & Khudanpur, S. (2010).</strong>
              Recurrent neural network based language model. <em>INTERSPEECH</em>, 1045-1048.
            </li>
            <li>
              <strong>Hochreiter, S., & Schmidhuber, J. (1997).</strong> Long short-term memory.
              <em>Neural Computation</em>, 9(8), 1735-1780.
            </li>
            <li>
              <strong>Cho, K., et al. (2014).</strong> Learning phrase representations using RNN encoder-decoder
              for statistical machine translation. <em>EMNLP</em>, 1724-1734.
            </li>
            <li>
              <strong>Vaswani, A., et al. (2017).</strong> Attention is all you need. <em>NeurIPS</em>, 5998-6008.
            </li>
            <li>
              <strong>Radford, A., et al. (2019).</strong> Language models are unsupervised multitask learners.
              <em>OpenAI Technical Report</em>.
            </li>
            <li>
              <strong>Merity, S., Xiong, C., Bradbury, J., & Socher, R. (2016).</strong> Pointer sentinel
              mixture models. <em>ICLR</em>.
            </li>
            <li>
              <strong>Press, O., & Wolf, L. (2017).</strong> Using the output embedding to improve
              language models. <em>EACL</em>, 157-163.
            </li>
            <li>
              <strong>Zhang, Y., et al. (2020).</strong> When does label smoothing help? <em>NeurIPS</em>.
            </li>
          </ol>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-6 text-black">Datasets</h2>
          <ul className="space-y-3 text-gray-700">
            <li><strong>WikiText-2 / WikiText-103</strong> — Merity et al. (2016). <a href="https://blog.einstein.ai/the-wikitext-long-term-dependency-language-modeling-dataset/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Link</a></li>
            <li><strong>Penn Treebank (PTB)</strong> — Marcus et al. (1993). <a href="https://www.cis.upenn.edu/~treebank/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Link</a></li>
            <li><strong>1 Billion Word Benchmark</strong> — Chelba et al. (2013). <a href="http://www.statmt.org/lm-benchmark/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Link</a></li>
            <li><em>Replace with your actual dataset source</em></li>
          </ul>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-6 text-black">Code & AI Tool Disclosure</h2>
          <div className="space-y-4 text-gray-700">
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">Framework & Libraries</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>PyTorch / TensorFlow — deep learning framework</li>
                <li>NumPy, Pandas — data processing</li>
                <li>scikit-learn — preprocessing, metrics</li>
                <li>Matplotlib / Seaborn — visualization</li>
                <li>Next.js + React + Tailwind CSS — this showcase website</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
              <h3 className="font-semibold text-purple-800 mb-2">AI Assistance</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>GitHub Copilot</strong> — code completion & boilerplate</li>
                <li><strong>Claude (Anthropic)</strong> — architecture discussion, code review, documentation</li>
                <li><strong>ChatGPT (OpenAI)</strong> — debugging, explanation of concepts</li>
              </ul>
              <p className="text-sm text-purple-700 mt-2">
                All model implementations, experimental code, and analysis were written by the team.
                AI tools assisted with syntax, refactoring, and explanation — not core algorithm design.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-6 text-black">Project Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="https://github.com/your-username/project-mfs"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-black/50 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-8 h-8 text-black group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                <span className="font-semibold text-lg">GitHub Repository</span>
              </div>
              <p className="text-gray-600 text-sm">Source code, experiments, and trained models</p>
            </a>
            <a
              href="https://docs.google.com/presentation/d/your-slides"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-black/50 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-8 h-8 text-yellow-600 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V7h10v2z"/></svg>
                <span className="font-semibold text-lg">Presentation Slides</span>
              </div>
              <p className="text-gray-600 text-sm">Project presentation (PDF / Google Slides)</p>
            </a>
            <a
              href="https://your-username.github.io/project-mfs"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-black/50 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-8 h-8 text-blue-600 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                <span className="font-semibold text-lg">Live Demo</span>
              </div>
              <p className="text-gray-600 text-sm">Deployed showcase website (GitHub Pages / Vercel)</p>
            </a>
            <a
              href="https://wandb.ai/your-project"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-black/50 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-8 h-8 text-yellow-500 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.21c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
                <span className="font-semibold text-lg">Experiment Logs</span>
              </div>
              <p className="text-gray-600 text-sm">Weights & Biases / TensorBoard / MLflow</p>
            </a>
          </div>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">License & Attribution</h2>
          <p className="text-gray-700 mb-4">
            This project is released under the <strong>MIT License</strong>. You are free to use,
            modify, and distribute with attribution.
          </p>
          <p className="text-gray-600 text-sm">
            Dataset licenses vary — verify terms before redistribution. Pretrained model weights
            (if used) subject to their respective licenses (e.g., OpenRAIL, Apache 2.0, MIT).
          </p>
        </section>
      </div>
    </main>
  );
}