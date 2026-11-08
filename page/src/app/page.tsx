import Link from "next/link";

export default function Home() {
  const groupMembers = [
    "Member 1 — Role",
    "Member 2 — Role",
    "Member 3 — Role",
    "Member 4 — Role",
  ];

  const sections = [
    { href: "/dataset", title: "Dataset", desc: "Source, size, features, target & preprocessing" },
    { href: "/methods", title: "Methods", desc: "N-gram, FFNN, RNN — how they work & implementation" },
    { href: "/experiments", title: "Experiments", desc: "Data splits, metrics, hyperparameters" },
    { href: "/results", title: "Results", desc: "Comparison tables & figures across all models" },
    { href: "/discussion", title: "Discussion", desc: "Analysis, limitations & future improvements" },
    { href: "/references", title: "References", desc: "Citations, disclosures & links" },
  ];

  return (
    <main className="flex-1 min-h-screen py-32 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="font-abril text-5xl md:text-7xl mb-6 text-black">
            Project MFS
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Next Word Prediction with N-gram, Feed Forward Neural Network,
            and Recursive Neural Network
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {groupMembers.map((member, i) => (
              <span key={i} className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-gray-200">
                {member}
              </span>
            ))}
          </div>
        </section>

        {/* Problem Statement & Motivation */}
        <section className="mb-20 p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200">
          <h2 className="font-abril text-3xl mb-4 text-black">Problem Statement & Motivation</h2>
          <div className="prose max-w-none text-gray-700">
            <p className="mb-4">
              <strong>Problem:</strong> Given a sequence of words, predict the most probable next word.
              This is a fundamental task in natural language processing with applications in
              autocomplete, text generation, and language modeling.
            </p>
            <p className="mb-4">
              <strong>Motivation:</strong> Comparing classical statistical approaches (N-grams) with
              modern neural architectures (FFNN, RNN) reveals the trade-offs between simplicity,
              interpretability, and predictive power. Understanding these trade-offs guides
              model selection for real-world deployment constraints.
            </p>
          </div>
        </section>

        {/* Navigation Cards */}
        <section>
          <h2 className="font-abril text-3xl mb-8 text-center text-black">Explore the Project</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 hover:border-black/50 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="font-abril text-2xl mb-3 text-black group-hover:text-gray-800">
                  {section.title}
                </h3>
                <p className="text-gray-600">{section.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}