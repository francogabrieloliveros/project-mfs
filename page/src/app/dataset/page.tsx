export default function DatasetPage() {
  return (
    <main className="flex-1 min-h-screen py-24 px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center">
          <h1 className="font-abril text-5xl md:text-6xl mb-4 text-black">
            Dataset
          </h1>
          <p className="text-xl text-gray-600">
            Source, size, features, target, and preprocessing
          </p>
        </header>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">Source</h2>
          <p className="text-gray-700">Dataset source description here...</p>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">
            Size & Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="font-abril text-3xl text-black">0</p>
              <p className="text-gray-600">Total Tokens</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="font-abril text-3xl text-black">0</p>
              <p className="text-gray-600">Vocabulary Size</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="font-abril text-3xl text-black">0</p>
              <p className="text-gray-600">Sequences</p>
            </div>
          </div>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">
            Features & Target
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Input Features
              </h3>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>Previous n words (context window)</li>
                <li>One-hot / embedding representations</li>
                <li></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Target Variable
              </h3>
              <p className="text-gray-700">
                Next word in sequence (classification over vocabulary)
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8">
          <h2 className="font-abril text-2xl mb-4 text-black">
            Preprocessing Steps
          </h2>
          <ol className="text-gray-700 space-y-3 list-decimal list-inside">
            <li>Tokenization (word-level / subword / character)</li>
            <li>Lowercasing & punctuation handling</li>
            <li>
              Vocabulary construction (frequency threshold,{" "}
              <code className="bg-gray-100 px-1 rounded">UNK</code> token)
            </li>
            <li>Sequence creation (sliding window, fixed context length)</li>
            <li>Train/validation/test split</li>
            <li></li>
          </ol>
        </section>
      </div>
    </main>
  );
}
