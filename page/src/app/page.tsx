import Link from "next/link";

const projectAreas = [
  {
    href: "/dataset",
    title: "Dataset",
    description: "Explore the WikiText-2 data used to train and evaluate our models.",
  },
  {
    href: "/methods",
    title: "Methods",
    description: "See how n-gram, feed-forward, and recurrent models predict words.",
  },
  {
    href: "/experiments",
    title: "Experiments",
    description: "Review the data splits, settings, and evaluation metrics.",
  },
  {
    href: "/results",
    title: "Results",
    description: "Compare model performance on next-word prediction.",
  },
  {
    href: "/discussion",
    title: "Discussion",
    description: "Read what the results show, along with limitations and future work.",
  },
  {
    href: "/references",
    title: "References",
    description: "Find the sources and tools used throughout the project.",
  },
];

export default function Home() {
  return (
    <>
      <section className="px-6 pb-20 pt-28 md:pb-24 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <header className="mx-auto mb-10 max-w-3xl text-center">
            <h1 className="font-abril mb-5 text-5xl leading-tight text-black sm:text-6xl md:text-7xl">
              Project MFS
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-700 md:text-xl">
              We compare <span className="font-semibold text-[#d889a7]">n-gram</span>,{" "}
              <span className="font-semibold text-[#79a9cf]">feed-forward</span>, and{" "}
              <span className="font-semibold text-[#a68bc1]">recurrent neural networks</span>{" "}
              to understand how computers predict what comes next in a text.
            </p>
            <p className="mt-5 text-sm leading-relaxed text-gray-600">
              Oliveros, Franco Gabriel P. <span aria-hidden="true">·</span>{" "}
              Silva, Samuel <span aria-hidden="true">·</span> Torres, Marck John M.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a
                href="https://github.com/francogabrieloliveros/project-mfs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/65 px-5 py-3 text-sm font-medium text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_6px_20px_rgba(0,0,0,0.06)] backdrop-blur-2xl transition hover:bg-white/85"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.5-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 .1.75 2.25 3.35 1.6.1-.73.4-1.23.72-1.51-2.5-.29-5.13-1.25-5.13-5.57 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.43.1-2.98 0 0 .95-.3 3.08 1.15a10.7 10.7 0 0 1 5.61 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.23 2.69.12 2.98.72.79 1.15 1.79 1.15 3.02 0 4.33-2.63 5.27-5.14 5.56.41.35.77 1.03.77 2.08v3.09c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z" />
                </svg>
                View repository ↗
              </a>
              <a
                href="https://canva.link/2nbkshkl40cf0r4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-black/2 px-5 py-3 text-sm font-medium text-gray-900 backdrop-blur-sm transition hover:bg-black/5"
              >
                <svg aria-hidden="true" viewBox="0 0 48 48" className="h-6 w-6 shrink-0">
                  <defs>
                    <linearGradient id="canva-mark" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#00c4cc" />
                      <stop offset="0.52" stopColor="#3584e4" />
                      <stop offset="1" stopColor="#7d2ae8" />
                    </linearGradient>
                  </defs>
                  <circle cx="24" cy="24" r="24" fill="url(#canva-mark)" />
                  <text x="24" y="35" textAnchor="middle" fill="white" fontFamily="cursive" fontSize="35" fontStyle="italic" fontWeight="700">C</text>
                </svg>
                Presentation slides ↗
              </a>
            </div>
          </header>

          <article className="mb-16 rounded-3xl border border-white/70 bg-white/65 p-6 shadow-sm backdrop-blur-sm md:p-8">
            <h2 className="font-abril mb-4 text-2xl text-black md:text-3xl">
              Problem Statement &amp; Motivation
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
              <strong className="text-black">Problem:</strong> Given a sequence
              of words, predict the most probable next word. This is a
              fundamental task in natural language processing with applications
              in autocomplete, text generation, and language modeling.
            </p>
            <p className="text-sm leading-relaxed text-gray-700 md:text-base">
              <strong className="text-black">Motivation:</strong> Comparing
              classical statistical approaches (N-grams) with modern neural
              architectures (FFNN, RNN) reveals the trade-offs between
              simplicity, interpretability, and predictive power. Understanding
              these trade-offs guides model selection for real-world deployment
              constraints.
            </p>
          </article>

          <h2 className="font-abril mb-6 text-center text-3xl text-black md:text-4xl">
            Explore the Project
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projectAreas.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="group min-h-40 rounded-3xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:border-black/20 hover:bg-white/90 hover:shadow-md"
              >
                <h2 className="mb-2 text-lg font-bold text-black">{area.title}</h2>
                <p className="mb-5 text-sm leading-relaxed text-gray-700">
                  {area.description}
                </p>
                <span className="text-xs font-medium text-gray-600 group-hover:text-black">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
