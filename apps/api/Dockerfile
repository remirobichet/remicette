FROM node:20-bullseye-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends git openssh-client \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable

COPY . /app

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @remicette/api build

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app/apps/api

CMD ["sh", "-c", "git config --global --add safe.directory /repo && node dist/main"]
