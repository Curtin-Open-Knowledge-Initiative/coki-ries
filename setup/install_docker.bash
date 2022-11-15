#!/bin/bash

if [[ ! $1 ]]; then
  echo "ERROR: path to keyfile not provided"
  exit
fi
KEYFILE="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"

if [[ ! -f $KEYFILE ]]; then
  echo "ERROR: the specified keyfile could not be found: ${KEYFILE}"
  exit
fi
if [[ ! -d ries ]]; then mkdir ries; fi
cd ries
wget https://storage.googleapis.com/rt-era-public/code/release/ries/Dockerfile
docker build --tag coki --no-cache .
docker run --rm -it --volume $KEYFILE:/app/.keyfile coki sh

#docker run --rm -it --volume $KEYFILE:/app/.keyfile coki 'sh && node /app/code/utilities/test_config.js'
