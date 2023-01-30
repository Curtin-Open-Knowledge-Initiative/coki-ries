#!/bin/bash

# check that the user provided a keyfile as the first parameter
if [[ ! $1 ]]; then echo "ERROR: you need to provide the path to your keyfile as the first parameter"; exit; fi
KEYFILE="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
if [[ ! -f $KEYFILE ]]; then echo "ERROR: the specified keyfile could not be found: ${KEYFILE}"; exit; fi

# check dependencies
echo "Checking dependencies:"
if [[ ! -z `which brew` && -z `which curl` ]]; then brew update && brew upgrade && brew install curl; fi
if [[ ! -z `which apk`  && -z `which curl` ]]; then apk update && apk upgrade && apk add curl; fi

if [[ -z `which curl`   ]]; then echo 'ERROR: this script requires `curl` at the command line. Please install it with your package manager'; exit; fi
if [[ -z `which docker` ]]; then echo 'ERROR: this script requires `docker` at the command line. Please install it with your package manager'; exit; fi

echo " - found curl"
echo " - found `docker --version`"

# use a working directory
if [[ ! -d ries ]]; then mkdir ries; fi
cd ries
if [[ ! -d data ]]; then mkdir data; fi
if [[ ! -d conf ]]; then mkdir conf; fi

# fetch files
BUCKET="gs://rt-era-public/code/release/ries"
echo $BUCKET
if [[ ! -f Dockerfile ]];        then gsutil cp $BUCKET/Dockerfile ./; fi
if [[ ! -f docker_build.bash ]]; then gsutil cp $BUCKET/docker_build.bash ./; fi
if [[ ! -f docker_start.bash ]]; then gsutil cp $BUCKET/docker_start.bash ./; fi
if [[ ! -f setup/.config.json ]]; then gsutil cp $BUCKET/example_config.json setup/; fi

# set up the symlink to the provided keyfile
echo "Linking keyfile:"
if [[ ! -L conf/.access.json ]]; then ln -s $KEYFILE setup/.access.json; fi
if [[ ! -L conf/.access.json ]]; then 
  echo "ERROR: unable to create a symlink to keyfile: $KEYFILE"; exit; 
else
  echo "Success"
fi

echo "Building docker image:"
docker build --tag ries --no-cache .

echo "Testing connection:"
docker run --rm -it \
  --volume $KEYFILE:/app/setup/.access.json \
ries node . config_test

echo "Testing generation of default SQL:"
docker run --rm -it \
  --volume $KEYFILE:/app/setup/.access.json \
ries node . compile_all --dryrun --verbose

echo "Starting container for general use:"
docker run --rm -it \
  --volume $PWD/data:/app/data \
  --volume $KEYFILE:/app/setup/.access.json \
ries sh
