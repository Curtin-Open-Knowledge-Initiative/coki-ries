# run a singleton instance named 'ries', mounting in the conf and data directories
# the script expects the config and data directories to be provided
cd `dirname ${BASH_SOURCE[0]}`
docker run --rm -it --name ries \
  --volume $(readlink -f dirname $1):/app/setup \
  --volume $(readlink -f dirname $2):/app/data \
ries sh
