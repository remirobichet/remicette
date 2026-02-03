FROM node:20-bullseye

WORKDIR /app

RUN corepack enable

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY . /app

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @remicette/web build

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app/apps/web

CMD ["node", ".output/server/index.mjs"]
