import Link from "next/link";

export default function Home() {
  const groupMembers = [
    "Member 1 — Role",
    "Member 2 — Role",
    "Member 3 — Role",
    "Member 4 — Role",
  ];

  const sections = [
    {
      href: "/dataset",
      title: "Dataset",
      desc: "Source, size, features, target & preprocessing",
    },
    {
      href: "/methods",
      title: "Methods",
      desc: "N-gram, FFNN, RNN — how they work & implementation",
    },
    {
      href: "/experiments",
      title: "Experiments",
      desc: "Data splits, metrics, hyperparameters",
    },
    {
      href: "/results",
      title: "Results",
      desc: "Comparison tables & figures across all models",
    },
    {
      href: "/discussion",
      title: "Discussion",
      desc: "Analysis, limitations & future improvements",
    },
    {
      href: "/references",
      title: "References",
      desc: "Citations, disclosures & links",
    },
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
            Next Word Prediction with N-gram, Feed Forward Neural Network, and
            Recursive Neural Network
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {groupMembers.map((member, i) => (
              <span
                key={i}
                className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-gray-200"
              >
                {member}
              </span>
            ))}
          </div>
        </section>

        {/* Problem Statement & Motivation */}
        <section className="mb-20 p-8 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200">
          <h2 className="font-abril text-3xl mb-4 text-black">
            Problem Statement & Motivation
          </h2>
          <div className="prose max-w-none text-gray-700">
            <p className="mb-4">
              <strong>Problem:</strong> Given a sequence of words, predict the
              most probable next word. This is a fundamental task in natural
              language processing with applications in autocomplete, text
              generation, and language modeling.
            </p>
            <p className="mb-4">
              <strong>Motivation:</strong> Comparing classical statistical
              approaches (N-grams) with modern neural architectures (FFNN, RNN)
              reveals the trade-offs between simplicity, interpretability, and
              predictive power. Understanding these trade-offs guides model
              selection for real-world deployment constraints.
            </p>
          </div>
        </section>

        {/* Project Links */}
        <section className="mb-20">
          <h2 className="font-abril text-3xl mb-6 text-black text-center">
            Project Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="https://github.com/francogabrieloliveros/project-mfs"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-black/50 hover:shadow-lg transition-all flex flex-col"
            >
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-8 h-8 text-black group-hover:scale-110 transition"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="font-semibold text-lg">GitHub Repository</span>
              </div>
              <p className="text-gray-600 text-sm">
                Source code, experiments, and trained models
              </p>
            </a>
            <a
              href="https://docs.google.com/presentation/d/your-slides"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-black/50 hover:shadow-lg transition-all flex flex-col"
            >
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-8 h-8 text-yellow-600 group-hover:scale-110 transition"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V7h10v2z" />
                </svg>
                <span className="font-semibold text-lg">
                  Presentation Slides
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                Project presentation (PDF / Google Slides)
              </p>
            </a>
          </div>
        </section>

        {/* Navigation Cards */}
        <section>
          <h2 className="font-abril text-3xl mb-8 text-center text-black">
            Explore the Project
          </h2>
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
