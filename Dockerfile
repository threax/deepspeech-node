FROM node:latest

RUN npm install deepspeech
RUN npm install node-wav
RUN npm install threads
RUN npm install uuid

COPY bin ./
