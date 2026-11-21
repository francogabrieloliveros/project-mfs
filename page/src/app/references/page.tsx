const sectionClass =
  "bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8";

// Paste your references here.
const references: string[] = [
  "StatQuest with Josh Starmer. (2020, August 31). The essential main ideas of neural networks [Video]. YouTube. https://youtu.be/CqOfi41LfDw",
  "StatQuest with Josh Starmer. (2020, November 23). Neural networks pt. 3: ReLU in action!!! [Video]. YouTube. https://youtu.be/68BZ5f7P94E",
  "GeeksforGeeks. (2026, May 6). Introduction to recurrent neural networks. https://www.geeksforgeeks.org/machine-learning/introduction-to-recurrent-neural-network/",
  "StatQuest with Josh Starmer. (2019, February 5). Gradient descent, step-by-step [Video]. YouTube. https://youtu.be/sDv4f4s2SB8",
  "StatQuest with Josh Starmer. (2020, October 19). Neural networks pt. 2: Backpropagation main ideas [Video]. YouTube. https://youtu.be/IN2XmBhILt4",
  "Samson Zhang. (2020, November 24). Building a neural network FROM SCRATCH (no Tensorflow/Pytorch, just numpy & math) [Video]. YouTube. https://youtu.be/w8yWXqWQYmU",
  "StatQuest with Josh Starmer. (2021, February 8). Neural networks part 5: ArgMax and SoftMax [Video]. YouTube. https://youtu.be/KpKog-L9veg",
  "StatQuest with Josh Starmer. (2022, July 11). Recurrent neural networks (RNNs), clearly explained!!! [Video]. YouTube. https://youtu.be/AsNTP8Kwu80",
  "StatQuest with Josh Starmer. (2022, November 7). Long short-term memory (LSTM), clearly explained [Video]. YouTube. https://youtu.be/YCzL96nL7j0",
  "dida. (2026, November 18). What is an LSTM neural network? https://dida.do/what-is-an-lstm-neural-network",
];

export default function ReferencesPage() {
  const sortedReferences = [...references].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );

  return (
    <main className="flex-1 min-h-screen py-24 px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center">
          <h1 className="font-abril text-5xl md:text-6xl mb-4 text-black">
            References
          </h1>
          <p className="text-xl text-gray-600">
            Citations, disclosures, and links
          </p>
        </header>

        {/* References */}
        <section className={sectionClass}>
          <h2 className="font-abril text-2xl mb-6 text-black">References</h2>
          <div className="space-y-3 text-gray-700 text-sm">
            {sortedReferences.map((ref, i) => (
              <p
                key={i}
                className="pl-8 text-justify"
                style={{ textIndent: "-2rem" }}
              >
                {ref}
              </p>
            ))}
          </div>
        </section>

        {/* AI disclosure */}
        <section className={sectionClass}>
          <h2 className="font-abril text-2xl mb-6 text-black">
            AI Tool Disclosure
          </h2>
          <p className="text-gray-700 text-justify">
            Several Large Language Models (LLMs)—specifically ChatGPT, Claude,
            and Gemini—were utilized throughout this project for similar
            purposes. First, they assisted with idea validation, allowing us to
            check minor technical questions before consulting the instructor.
            Second, they provided preliminary suggestions that, combined with
            our independent research, helped establish a solid foundation for
            our concepts. Third, they served as study aids to clarify technical
            concepts and deepen our understanding of the underlying mechanics of
            the methods we implemented. Fourth, they were used for code
            optimization to fix logical and computational bottlenecks we might
            have overlooked, particularly to improve the runtime efficiency of
            model training. Finally, they helped in boilerplate generation for
            the project web page by scaffolding the initial files before we
            populated them with our actual findings and details. Despite the use
            of these tools, full responsibility for the accuracy and content of
            this page and repository rests entirely with the team.
          </p>
        </section>
      </div>
    </main>
  );
}
