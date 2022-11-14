FROM node:16.10-alpine as development

WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm run migration:run:dev

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
