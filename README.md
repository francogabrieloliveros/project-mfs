# Project MFS

This project implements a next-word prediction and sentence completion model. Three methods — n-gram, feed-forward, and recurrent neural networks — were built and evaluated to achieve the project's goal; all of which were trained on [WikiText2 Raw V1](https://huggingface.co/datasets/Salesforce/wikitext) dataset.

See [our page](https://francogabrieloliveros.github.io/project-mfs/).

## Sections

1. [Dataset](#dataset)
2. [Installation](#installation)
3. [Running the models](#running-the-models)
4. [Running the page](#running-the-page)
5. [Task log](#task-log)
6. [Project structure](#project-structure)

## Dataset

The models were trained on the [WikiText2 Raw v1](https://huggingface.co/datasets/Salesforce/wikitext) dataset from Salesforce, hosted on Hugging Face:

https://huggingface.co/datasets/Salesforce/wikitext

## Installation

Clone the repository:

```bash
git clone https://github.com/francogabrieloliveros/project-mfs
cd project-mfs
```

### Prerequisites

The repository uses two different package managers, `uv` for Python packages and `npm` for TypeScript packages.

Install uv:

```bash
# macOS
brew install uv

# Fedora
sudo dnf install uv
```

Install npm:

```bash
# macOS
brew install node

# Fedora
sudo dnf install nodejs
```

## Running the models

Before running the page, make sure to sync dependencies first:

```bash
cd models
uv sync
```

From `models/`, run the main training/demo script:

```bash
uv run main.py
```

Currently, `main.py` skips the training and uses the `.npz` files under `models/training/` so you do not have to train the models yourself. However, if you want to try training the models, you can delete the `.npz` files in the folder **(not recommended)**.

`main.py` loads the dataset, trains the n-gram, feed-forward neural network (FFNN), and recurrent neural network (RNN) models, then runs a demo and evaluation on the test set.

You can also run individual source modules under `models/src/` directly, for example:

```bash
uv run src/train_models.py
uv run src/run_demo.py
uv run src/run_test.py
uv run src/load_dataset.py
```

## Running the page

If you do not want to run the page locally, you have the option to visit [our page](https://francogabrieloliveros.github.io/project-mfs/).

Otherwise, before running the page, make sure to sync dependencies first:

```bash
cd page
npm install
```

Start the Next.js development server from `page/`:

```bash
npm run dev
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser to see the site.

## Task log

### Franco Gabriel P. Oliveros

- Project and folder structure setup of `models/` and `page/`
- Added the RNN model with its training weights
- Added tokenizer and evaluation functions
- Added the dataset page

### Samuel P. Silva

- Added the n-gram model with its training weights
- Added the experiments page
- Added the results page

### Marck John M. torres

- Added the FFNN model with its training weights
- Added the home page
- Added the discussion page

## Project structure

```
project-mfs/
├── README.md                      # this file
├── .github/workflows/deploy.yml   # GitHub Pages deploy workflow
├── models/                        # Python language models (uv-managed)
│   ├── main.py                    # entry point: train, demo, and test all models
│   ├── pyproject.toml             # project dependencies (numpy, tqdm)
│   ├── classes/                   # model implementations (ngram, ffnn, rnn, tokenizer)
│   ├── src/                       # dataset loading, training, demo, and test scripts
│   ├── dataset/                   # train/validation/test splits
│   └── training/                  # trained model checkpoints (.npz)
└── page/                          # Next.js documentation/demo site
    ├── package.json
    ├── next.config.ts             # GitHub Pages basePath export config
    └── src/app/                   # app router pages (home, dataset, models, results, ...)
```
