FROM node:latest

RUN npm install deepspeech
RUN npm install node-wav
RUN npm install threads
RUN npm install uuid

COPY bin/client.js client.js
COPY bin/server.js server.js
COPY bin/parser.js parser.js
COPY bin/worker.js worker.js
