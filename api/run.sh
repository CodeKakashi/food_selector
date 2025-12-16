#!/bin/bash
set -e

# Project root (one level above api/)
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# Find venv activate script (common locations)
if [ -f "$PROJECT_ROOT/api/venv/bin/activate" ]; then
  source "$PROJECT_ROOT/api/venv/bin/activate"
elif [ -f "$PROJECT_ROOT/api/.venv/bin/activate" ]; then
  source "$PROJECT_ROOT/api/.venv/bin/activate"
else
  echo "❌ Could not find venv activation script."
  echo "Checked:"
  echo " - $PROJECT_ROOT/venv/bin/activate"
  echo " - $PROJECT_ROOT/.venv/bin/activate"
  exit 1
fi

python api/run.py

