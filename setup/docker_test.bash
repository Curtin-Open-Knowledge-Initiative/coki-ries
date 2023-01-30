# test if bigquery is accessible
# provide the path to your access keyfile as the first parameter
cd `dirname ${BASH_SOURCE[0]}`
docker run --rm --volume $(readlink -f $1):/app/setup/.access.json cokicurtin/ries:latest node . config_test
