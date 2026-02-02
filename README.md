# Remicette VPS Deployment (Docker + Caddy)

This app runs a Nuxt frontend and a Nest API. The API writes new recipes to the repo and can auto-commit/push to GitHub using a deploy key. The frontend must run in Nuxt server mode (not static generate) so new recipes appear immediately without rebuilds.

## Domains

- Frontend: `https://remicette.remirobichet.fr`
- API: `https://api.remicette.remirobichet.fr`

## VPS Paths

- Repo root on host: `/srv/remicette`
- API container repo root: `/repo` (bind-mounted from `/srv/remicette`)

## Why Nuxt server mode

The API writes markdown to `apps/web/content`. To see new recipes immediately, the Nuxt app must read this directory at runtime. Static generation will not update until you rebuild.

## Required Environment Variables (API)

These are needed for auto-commit and push on every new recipe:

```bash
REPO_ROOT=/repo
RECIPE_GIT_AUTO_COMMIT=true
GIT_AUTHOR_NAME="Remicette Bot"
GIT_AUTHOR_EMAIL="bot@remicette.remirobichet.fr"
GIT_COMMITTER_NAME="Remicette Bot"
GIT_COMMITTER_EMAIL="bot@remicette.remirobichet.fr"
GIT_SSH_COMMAND="ssh -i /keys/github_deploy -o StrictHostKeyChecking=accept-new"
```

You also need the Replicate token for the extractor:

```bash
REPLICATE_API_TOKEN=...
```

## GitHub Deploy Key

- Create a read/write deploy key in GitHub.
- Mount the private key into the API container at `/keys/github_deploy`.
- Ensure `git` is installed in the API container.
- The API container must have `.git` available (bind-mount the full repo).

## Docker + Caddy Overview

- `web` service: Nuxt server (`nuxi build` then `node .output/server/index.mjs`).
- `api` service: Nest API (`nest build` then `node dist/main`).
- `caddy` service: TLS + reverse proxy.
- Shared bind mounts:
  - `/srv/remicette` → `/repo` in the API container.
  - `/srv/remicette/apps/web/content` mounted into the web container so content updates are visible at runtime.

See `docker-compose.yml`, `Caddyfile`, `apps/web/Dockerfile`, and `apps/api/Dockerfile` for the exact setup.

## Runtime Behavior

- The API writes `apps/web/content/*.md` through `REPO_ROOT`.
- After a successful write, it auto-commits and pushes the new recipe when `RECIPE_GIT_AUTO_COMMIT=true`.
- Caddy routes traffic:
  - `remicette.remirobichet.fr` → Nuxt web container
  - `api.remicette.remirobichet.fr` → Nest API container

## Notes

- Ensure the mounted content directory is writable by the API container user.
- If multiple requests happen at once, the API uses a lock file to serialize git commits.

## Ubuntu 25.04 VPS setup

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Log out and back in so the Docker group applies.

```bash
sudo mkdir -p /srv/remicette
sudo chown -R $USER:$USER /srv/remicette
git clone <your-repo-url> /srv/remicette
cd /srv/remicette

mkdir -p deploy-keys
chmod 600 deploy-keys/github_deploy

cp .env.example .env
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

DNS records:

- `remicette.remirobichet.fr` → VPS public IP
- `api.remicette.remirobichet.fr` → VPS public IP
