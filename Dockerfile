FROM node:22.6.0-slim

WORKDIR /home/node/

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 5000

ENTRYPOINT ["npm", "start"]
