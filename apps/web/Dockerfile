FROM node:20-bullseye-slim

WORKDIR /app

RUN corepack enable

COPY . /app

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @remicette/web build

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app/apps/web

CMD ["node", ".output/server/index.mjs"]
