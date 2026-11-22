import Image from "next/image";
import lstmPic from "@/assets/lstm.webp";
import rnnPic from "@/assets/rnn.webp";

const sectionClass =
  "bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200 p-8";

export default function MethodsPage() {
  return (
    <main className="flex-1 min-h-screen py-24 px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center">
          <h1 className="font-abril text-5xl md:text-6xl mb-4 text-black">
            Methods
          </h1>
          <p className="text-xl text-gray-600">
            How each model works and implementation details
          </p>
        </header>

        {/* Overall implementation */}
        <section key="overall" className={sectionClass}>
          <h2 className="font-abril text-2xl mb-4 text-black">
            Overall Implementation
          </h2>
          <p className="text-gray-700 mb-4">
            All three models (N-gram, FFNN, and RNN) expose the same interface.
            and implements two methods:
          </p>
          <div className="text-gray-700 space-y-2 mb-4">
            <p>
              <strong>predict_next(prompt_ids):</strong> scores the vocabulary
              and returns the single most likely next word (plus the ranked
              candidate list).
            </p>
            <p>
              <strong>generate(prompt_ids, max_tokens):</strong> calls{" "}
              <code>predict_next</code> repeatedly to produce up to{" "}
              <code>max_tokens</code> new words, appending each to the prompt.
            </p>
          </div>
          <p className="text-gray-700 mb-4">
            Both methods accept the same parameters, which control how the next
            word is chosen:
          </p>
          <div className="bg-gray-50 rounded-2xl p-4">
            <table className="w-full text-left text-sm text-gray-700">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 font-semibold">Parameter</th>
                  <th className="py-2 font-semibold pl-5">What it does</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-mono">prompt_ids</td>
                  <td className="py-2 pl-5">
                    The tokenized input prompt (list of word IDs) that the model
                    conditions on when predicting the next word.
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-mono">max_tokens</td>
                  <td className="py-2 pl-5">
                    Maximum number of new words to generate. The loop stops
                    early if the model runs out of valid candidates.
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-mono">temperature</td>
                  <td className="py-2 pl-5">
                    Controls randomness. At 0 the model always picks the top
                    scoring word (greedy, deterministic). Higher values flatten
                    the probability distribution, making output more creative
                    and varied.
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-mono">top_k</td>
                  <td className="py-2 pl-5">
                    Limits sampling to the k most likely next words, so unlikely
                    outliers are never chosen.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">blocked_ids</td>
                  <td className="py-2 pl-5">
                    Token IDs the model is never allowed to predict (for us, the{" "}
                    <code>&lt;unk&gt;</code> token), so the model always outputs
                    a known word.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* N-gram card */}
        <section key="ngram" className={sectionClass}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h2 className="font-abril text-2xl text-black mb-4">
              N-gram Language Model
            </h2>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              Statistical
            </span>
          </div>
          <div className="prose max-w-none text-gray-700 mb-6">
            <p>
              Predicts the next word based on frequency counts of n-word
              sequences in training data. Uses the Markov assumption: the
              probability of the next word depends only on the previous n-1
              words.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Strengths
              </h3>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>Simple, interpretable</li>
                <li>Fast training/inference</li>
                <li>No GPU needed</li>
                <li>Good baseline</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Limitations
              </h3>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>Data sparsity problem</li>
                <li>Fixed context window</li>
                <li>No generalization to unseen n-grams</li>
                <li>Curse of dimensionality</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">
              Why we chose n = 2 (bigram)
            </h3>
            <p className="text-gray-700 mb-4 text-justify">
              We compared n = 2 to 5 on the same test queries. The bigram scored
              best on every metric. Longer contexts match more specific phrases,
              but they are also seen less often in training: at n = 3 only
              about 78% of test contexts appear in the training data, and at
              n = 5 only about 14%. Our n-gram has no backoff, so an unseen
              context has no candidates (a top-k miss) and gets a uniform
              probability, which raises perplexity. A one-word context is seen
              almost every time (about 99%), and common pairs such as{" "}
              <code>of the</code> repeat often in the training text.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-left text-sm text-gray-700">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 font-semibold">n</th>
                    <th className="py-2 font-semibold">Contexts seen</th>
                    <th className="py-2 font-semibold">Perplexity</th>
                    <th className="py-2 font-semibold">Top-1</th>
                    <th className="py-2 font-semibold">Top-5</th>
                    <th className="py-2 font-semibold">Top-10</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 font-semibold">
                    <td className="py-2">2</td>
                    <td className="py-2">99.33%</td>
                    <td className="py-2">898.41</td>
                    <td className="py-2">17.70%</td>
                    <td className="py-2">36.47%</td>
                    <td className="py-2">44.27%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">3</td>
                    <td className="py-2">77.87%</td>
                    <td className="py-2">6799.55</td>
                    <td className="py-2">15.00%</td>
                    <td className="py-2">26.03%</td>
                    <td className="py-2">30.00%</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">4</td>
                    <td className="py-2">39.33%</td>
                    <td className="py-2">20571.03</td>
                    <td className="py-2">7.83%</td>
                    <td className="py-2">12.10%</td>
                    <td className="py-2">12.77%</td>
                  </tr>
                  <tr>
                    <td className="py-2">5</td>
                    <td className="py-2">14.33%</td>
                    <td className="py-2">29286.55</td>
                    <td className="py-2">3.07%</td>
                    <td className="py-2">4.10%</td>
                    <td className="py-2">4.10%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 text-justify">
              The trade-off is that a bigram only sees the previous word, so
              text generated with it is locally plausible but drifts and can
              loop. It is best suited to next-word prediction, not to producing
              coherent sentences.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              Implementation Details
            </h3>
            <p className="text-gray-700 font-mono text-sm">
              Built with add-alpha smoothing, configurable n (2-5), efficient
              count storage. Final model: n = 2.
            </p>
          </div>
        </section>

        {/* FFNN card */}
        <section key="ffnn" className={sectionClass}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h2 className="font-abril text-2xl text-black mb-4">
              Feed-Forward Neural Network (FFNN)
            </h2>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              Neural (Fixed Context)
            </span>
          </div>
          <div className="prose max-w-none text-gray-700 mb-6">
            <p>
              Fixed-size context window fed through an embedding layer → hidden
              layers → output softmax over the vocabulary. Learns distributed
              word representations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Strengths
              </h3>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>Learns word embeddings</li>
                <li>Generalizes to similar contexts</li>
                <li>Parallelizable training</li>
                <li>Better than n-grams on seen data</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Limitations
              </h3>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>Fixed context window</li>
                <li>No sequential memory</li>
                <li>Many parameters</li>
                <li>Overfits on small data</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-800 mb-2">
              Implementation Details
            </h3>
            <p className="text-gray-700 font-mono text-sm">
              Embedding dim 128-512, 2-3 hidden layers (ReLU), dropout, Adam
              optimizer, cross-entropy loss.
            </p>
          </div>
        </section>

        {/* RNN card */}
        <section key="rnn" className={sectionClass}>
          <h3 className="font-abril text-2xl text-black mb-4">
            Recurrent Neural Network (LSTM)
          </h3>
          <Image
            src={rnnPic}
            alt="Recurrent neural network unrolled over time"
            className="w-1/4 h-auto rounded-2xl mx-auto"
          />

          <div className="mb-6">
            <p className="text-gray-700 mb-4 text-justify">
              The model reads the prompt one word at a time and carries a hidden
              state forward, to be used by the next word. So, each prediction
              can use the entire prompt rather than a fixed window. However,
              each iteration of this network uses repetitive multiplication of
              weights; and extremeley large (e.g. 999) or extremely small (e.g.
              0.000000001) weights can cause exploding (exponential increase) or
              vanishing (disappearance due to small value) gradients.
            </p>
            <Image
              src={lstmPic}
              alt="LSTM cell diagram"
              className="w-3/4 h-auto rounded-2xl mx-auto"
            />
            <p className="text-gray-700 mb-4 text-justify">
              To prevent vanishing gradients, we implemented RNN with LSTM. It
              keeps a long-term memory which has no direct weight multiplication
              and a short term memory which is directly multiplied to the
              weights. Using gates, both values are used to come up with a new
              LTM and STM for the next input to use while avoiding extremely
              small values.
            </p>
            <p className="text-gray-700 mb-4 text-justify">
              For exploding gradients, gradient clipping was implemented which
              limits the magnitued of gradients before gradient descent updates
              the weights.
            </p>
          </div>
          <h3 className="font-semibold roboto mb-2">Implementation</h3>
          <p className="text-gray-700 mb-4 text-justify">
            Due to memory constraints, we trained the model where each word was
            encoded with an embedding dimension of 64 and a hidden layer
            dimension of 128. Standard neural network training process (forward
            propagation &rarr; negative log likelihood loss calculation &rarr;
            backward propagation &rarr; stochastic gradient descent) was used,
            except using LSTM formulas and corresponding derivatives.
          </p>
          <p className="text-gray-700 mb-4 text-justify">
            The model was trained for 13 epochs with SGD and truncated
            backpropagation through time with length 32 and batch size 64 (due
            to memory and time constraints). As stated earlier, gradient
            clipping was also used at 0.25 and a learning rate that starts at 20
            and is divided by 4 when validation perplexity plateaus.
          </p>
        </section>
      </div>
    </main>
  );
}
