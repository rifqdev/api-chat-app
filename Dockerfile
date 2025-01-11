FROM node:20.17.0-alpine

COPY . /app/

WORKDIR /app

RUN npm install

CMD [ "npm", "start" ]