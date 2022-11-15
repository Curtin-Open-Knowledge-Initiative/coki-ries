# (re)build the docker image named 'coki:latest'
cd `dirname ${BASH_SOURCE[0]}`
docker build --tag coki:latest --no-cache .
