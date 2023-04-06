# Development
FROM node:16-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

# Production (multi-stage build)
FROM node:16-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:16-alpine AS production

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node serviceAccountKey.json .
COPY --chown=node:node .env .
COPY --chown=node:node assets ./assets
COPY --chown=node:node assets ./dist/assets
COPY --chown=node:node assets ./dist/src/assets

CMD [ "node", "dist/src/main.js" ]
