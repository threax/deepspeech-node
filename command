will show a debug message
docker run -it --rm --name deepspeech -v C:/Development/DeepSpeechModels/0.1.1:/opt/deepspeech deepspeech node client.js

should work but doesnt
docker run -it --rm --name deepspeech -v C:/Development/DeepSpeechModels/0.1.1:/opt/deepspeech deepspeech node client.js /opt/deepspeech/output_graph.pb /opt/deepspeech/alphabet.txt /opt/deepspeech/lm.binary /opt/deepspeech/trie /opt/deepspeech/test.wav