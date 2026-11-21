
import modal
import subprocess
import shutil
import os

app = modal.App("ffnn-training")

volume = modal.Volume.from_name(
    "ffnn-results",
    create_if_missing=True
)

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install("uv")
    .add_local_dir(
        ".",
        remote_path="/root/project",
        ignore=[
            ".git",
            ".venv",
            "__pycache__",
            ".pytest_cache",
        ],
    )
)

@app.function(
    image=image,
    cpu=4,
    memory=8192,
    timeout=86400,
    volumes={"/outputs": volume},
)
def train():
    project_dir = "/root/project"

    print("Starting FFNN training...")

    # Replace this with your actual training-only command.
    subprocess.run(
        ["uv", "run", "--project", project_dir, "main.py"],
        cwd=project_dir,
        check=True,
    )

    print("Training finished.")

    # Copy the trained model to persistent storage.
    model_path = os.path.join(
        project_dir,
        "training",
        "ffnn_model.npz",
    )

    if os.path.exists(model_path):
        shutil.copy2(
            model_path,
            "/outputs/ffnn_model.npz",
        )
        volume.commit()
        print("Model successfully saved to Modal Volume.")
    else:
        raise FileNotFoundError(
            f"Trained model not found: {model_path}"
        )


@app.local_entrypoint()
def main():
    train.remote()
