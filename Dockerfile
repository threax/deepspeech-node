FROM node:latest

RUN npm install deepspeech
RUN npm install node-wav

COPY client.js client.js
COPY server.js server.js
