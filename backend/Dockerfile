FROM node:alpine

RUN mkdir /back
WORKDIR /back

COPY . .
RUN npm i && npm install typescript -g && tsc

ENV BS_DATABASE_USER=bookshare
ENV BS_DATABASE_NAME=bookshare
ENV BS_DATABASE_HOST=localhost
ENV BS_DATABASE_PORT=5432

ENTRYPOINT npm run start