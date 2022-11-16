# run a singleton instance named 'coki', mounting in the conf and data directories
cd `dirname ${BASH_SOURCE[0]}`
docker run --rm -it --name coki \
  --volume ${PWD}/../conf:/app/setup \
  --volume ${PWD}/../data:/app/data \
coki:latest sh
