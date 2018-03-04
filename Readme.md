# deepspeech-node
This container will run a node webserver that will parse incoming 16kHz wav files to text using deepspeech from mozilla. It works on both the cpu and gpu version of the library using docker containers.

## Build
### Compile Typescript
tsc
### Cpu docker container
docker build -t deepspeech .

### Gpu docker container
docker build -f Dockerfile-gpu -t deepspeech-gpu .

## Run the Server

### Cpu
This will run the container on the cpu using a Windows path.

docker run -it --rm --name deepspeech -p 8080:80 -v C:/Development/DeepSpeechModels/0.1.1:/opt/deepspeech deepspeech

### Gpu
This will run the container on the gpu using Linux.

docker run -it --rm --runtime=nvidia --name deepspeech-gpu -p 8080:80 -v ~/dev/models:/opt/deepspeech deepspeech-gpu

## Make Request (Powershell)
curl -method POST -infile test.wav -uri http://localhost:8080/stt

## Kill Container
docker kill deepspeech

## Gpu Installation for Ubuntu
How to setup docker on an ubuntu machine that can run the gpu image. Assumes nvidia drivers are installed.

### Install Docker
1. sudo apt-get update
1. sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
1. curl -fsSL https://download.docker.com/linux/ubuntu/gpg | 4. sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
1. sudo apt-get update
1. sudo apt-get install docker-ce

### Install nvidia docker
1. curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
1. curl -s -L https://nvidia.github.io/nvidia-docker/ubuntu16.04/amd64/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
1. sudo apt-get update

1. sudo apt-get install nvidia-docker2
1. sudo pkill -SIGHUP dockerd

### Test Installation
docker run --runtime=nvidia --rm nvidia/cuda nvidia-smi