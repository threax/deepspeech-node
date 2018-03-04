# deepspeech-node
This container will run a node webserver that will parse incoming 16kHz wav files to text using deepspeech from mozilla.

## build
### compile typescript
tsc
### docker container
docker build -t deepspeech .

## run the server
docker run -it --rm --name deepspeech -p 8080:80 -v C:/Development/DeepSpeechModels/0.1.1:/opt/deepspeech deepspeech node server.js

## make request
curl -method POST -infile test.wav -uri http://localhost:8080/stt

## kill container
docker kill deepspeech