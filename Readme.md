# deepspeech-node
This container will run a node webserver that will parse incoming 16kHz wav files to text using deepspeech from mozilla.

## build
### compile typescript
tsc
### docker container
docker build -t deepspeech .

## run the server
docker run -it --rm --name deepspeech -p 8080:80 -v C:/Development/DeepSpeechModels/0.1.1:/opt/deepspeech deepspeech
docker run -it --rm --name deepspeech -p 8080:80 -v /home/threax/dev/models:/opt/deepspeech deepspeech

## make request
curl -method POST -infile test.wav -uri http://localhost:8080/stt

## kill container
docker kill deepspeech

## Gpu Version
Also a gpu version based on nvidia/cuda docker image

### Build
docker build -f Dockerfile-gpu -t deepspeech-gpu .

### Run
docker run -it --rm --runtime=nvidia --name deepspeech-gpu -p 8080:80 -v C:/Development/DeepSpeechModels/0.1.1:/opt/deepspeech deepspeech-gpu
docker run -it --rm --runtime=nvidia --name deepspeech-gpu -p 8080:80 -v /home/threax/dev/models:/opt/deepspeech deepspeech-gpu

### Installation
How to setup docker on an ubuntu machine that can run the gpu image.

#### Install Docker
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install docker-ce

#### Install nvidia docker
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/ubuntu16.04/amd64/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update

sudo apt-get install nvidia-docker2
sudo pkill -SIGHUP dockerd

#### test it with
docker run --runtime=nvidia --rm nvidia/cuda nvidia-smi