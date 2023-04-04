FROM node:16-alpine3.12 as development

WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
