FROM node:latest

RUN npm install deepspeech
RUN npm install node-wav
RUN npm install threads
RUN npm install uuid

COPY client.js client.js
COPY server.js server.js
COPY parser.js parser.js
COPY worker.js worker.js
