FROM node:12.16.2-alpine
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY src/. ./
RUN npm install
CMD [ "node", "index.js" ]