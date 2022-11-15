# test if bigquery is accessible
cd `dirname ${BASH_SOURCE[0]}`
docker run --rm --volume ${PWD}/../.keyfile:/app/.keyfile coki:latest node /app/code/utilities/test_config.js
