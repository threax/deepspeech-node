will show a debug message
docker run -it --rm --name deepspeech -v C:/Development/DeepSpeechModels/0.1.1:/opt/deepspeech deepspeech node client.js

will try to do everything
docker run -it --rm --name deepspeech -v C:/Development/DeepSpeechModels/0.1.1:/opt/deepspeech deepspeech node client.js /opt/deepspeech/output_graph.pb /opt/deepspeech/alphabet.txt /opt/deepspeech/lm.binary /opt/deepspeech/trie /opt/deepspeech/test.wav

build
docker build -t deepspeech .

run the server
docker run -it --rm --name deepspeech -p 8080:80 -v C:/Development/DeepSpeechModels/0.1.1:/opt/deepspeech deepspeech node server.js