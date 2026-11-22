const sectionClass =
  "bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8";

// Paste your references here.
const references: string[] = [
  "Kumaresan, S. (2024, February 16). Cracking the language code: A comprehensive guide to n-gram models and text generation. Medium. https://medium.com/@sundharesansk11/cracking-the-language-code-a-comprehensive-guide-to-n-gram-models-and-text-generation-b670335ce6e8",
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
  "The Coding Train. (n.d.). 10.12: Neural networks: Feedforward algorithm part 1 - the nature of code [Video]. YouTube. Retrieved November 22, 2026, from https://www.youtube.com/watch?v=qWK7yW8oS0I",
  "Neural networks from scratch - p.1 intro and neuron code - YouTube. (n.d.). Www.Youtube.Com. Retrieved November 22, 2026, from https://www.youtube.com/watch?v=Wo5dMEP_BbI&list=PLQVvvaa0QuDcjD5BAw2DxE6OF2tius3V3",
  "Chia, A. (2024, May 9). An introduction to batch processing. Splunk. https://www.splunk.com/en_us/blog/learn/batch-processing.html",
  "GeeksforGeeks. (2024, June 20). Feedforward neural network. GeeksforGeeks. https://www.geeksforgeeks.org/deep-learning/feedforward-neural-network/",
  "Mehra, V. (2025, September 16). Feed-forward neural networks explained: A complete tutorial. Datacamp.Com; DataCamp. https://www.datacamp.com/tutorial/feed-forward-neural-networks-explained",
  "Dr. Amir-Hossein Karimi. (2026, November 12). Lecture 09 part 05 -- feed-forward neural networks [Video]. YouTube. https://www.youtube.com/watch?v=Ts9chOhkc80",
  "Labate, D. (2024). Deep learning and neural networks. https://www.math.uh.edu/~dlabate/Lecture_6373_01.pdf",
  "Studyopedia Editorial Staff. (2024, October 6). Feedforward neural networks (FNN). Studyopedia. https://studyopedia.com/deep-learning/feedforward-neural-networks/",
  "A very basic introduction to feed-forward neural networks - DZone AI. (n.d.). Dzone.Com. Retrieved November 22, 2026, from https://dzone.com/articles/the-very-basic-introduction-to-feed-forward-neural",
  "Understanding feedforward neural networks | LearnOpenCV. (2017, October 9). https://learnopencv.com/understanding-feedforward-neural-networks/",
  "scgupta. (n.d.). Feedforward neural networks: The foundation of deep learning. Scgupta. Retrieved November 22, 2026, from https://www.ml4devs.com/what-is/feedforward-neural-networks/",
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
