"utility"
from pathlib import Path
from subprocess import run
def git_root() -> Path:
    return Path(
      run("git rev-parse --show-toplevel".split(" "), capture_output=True, check=True)
      .stdout.decode("utf-8")
      .rstrip()
    )
