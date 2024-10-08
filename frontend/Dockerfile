ARG NODE_VERSION=20.15.0

FROM node:${NODE_VERSION} AS base

ARG PORT=3000
WORKDIR /src

FROM base AS base-dev

ENV NODE_ENV=development

FROM base AS base-prod

ENV NODE_ENV=production

# Build 
FROM base-dev AS build-dev

COPY --link package.json package-lock.json ./
RUN npm install

# Build
FROM base-prod AS build-prod

COPY --link package.json package-lock.json ./
RUN npm install --production=false

COPY --link . .

RUN npm run build
RUN npm prune

# Run 
FROM base-dev AS run-dev

COPY --from=build-dev /src/node_modules /src/node_modules
COPY --from=build-dev /src/.nuxt /src/.nuxt
COPY --from=build-dev /src/package.json /src/package.json

CMD [ "npm", "run", "dev" ]

# Run
FROM base-prod AS run-prod

ENV PORT=$PORT

COPY --from=build-prod /src/.output /src/.output
# Optional, only needed if you rely on unbundled dependencies
# COPY --from=build-prod /src/node_modules /src/node_modules

CMD [ "node", ".output/server/index.mjs" ]