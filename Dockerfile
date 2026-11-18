# One image for every Node app in the workspace. Each compose service picks its app with `pnpm --filter`.
FROM node:22-bookworm-slim
RUN npm install -g pnpm@10.34.9
WORKDIR /repo

# Download dependencies from the lockfile alone, so this layer stays cached until dependencies change.
COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc package.json ./
RUN pnpm fetch

COPY . .
RUN pnpm install --offline --frozen-lockfile
