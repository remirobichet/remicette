#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$repo_root"

if [[ ! -f .env ]]; then
  echo "Missing .env. Copy .env.example to .env and fill values." >&2
  exit 1
fi

docker compose pull
docker compose build
docker compose up -d
