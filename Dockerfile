FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
RUN pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile

# ---- dev: source is bind-mounted in, nest watches and rebuilds ----
FROM deps AS dev
ENV NODE_ENV=development
ENV TSC_WATCHFILE=PriorityPollingInterval
ENV TSC_WATCHDIRECTORY=DynamicPriorityPolling
EXPOSE 3000
CMD ["pnpm", "start:dev"]

FROM deps AS build
RUN pnpm build

# ---- prod: only compiled dist + prod deps, non-root user ----
FROM base AS prod
ENV NODE_ENV=production
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
RUN pnpm fetch --prod
RUN pnpm install --offline --frozen-lockfile --prod
COPY --from=build /app/dist ./dist

RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3000
CMD ["node", "dist/main.js"]
