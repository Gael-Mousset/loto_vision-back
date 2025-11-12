FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY .env ./

ARG WEB_SITE_URL
ENV WEB_SITE_URL=$WEB_SITE_URL

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:dev"]