# (re)build a local docker image named 'ries'
cd `dirname ${BASH_SOURCE[0]}`
docker build --tag ries --no-cache .
