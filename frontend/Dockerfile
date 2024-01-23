FROM node:18.19.0-alpine3.18

RUN npm install -g http-server

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ENV NODE_ENV production

RUN npm run build

EXPOSE 8080

CMD [ "http-server", "dist" ]
