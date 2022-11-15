#!/bin/bash

# check dependencies
if [[ ! -z `which apk` ]]; then
  apk update && apk upgrade
  apk add unzip curl nodejs npm
fi
if [[ ! -z `which brew` ]]; then
  brew update && brew upgrade
  brew install curl
fi
if [[ -z `which curl`  ]]; then echo 'ERROR: this script requires `curl` at the command line' ; exit; fi
if [[ -z `which unzip` ]]; then echo 'ERROR: this script requires `unzip` at the command line'; exit; fi
if [[ -z `which node`  ]]; then echo 'ERROR: this script requires `node` at the command line' ; exit; fi
if [[ -z `which npm`   ]]; then echo 'ERROR: this script requires `npm` at the command line'  ; exit; fi

# check that a keyfile has been provided
if [[ ! $1 ]]; then echo "ERROR: path to keyfile not provided"; exit; fi
KEYFILE="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
if [[ ! -f $KEYFILE ]]; then echo "ERROR: the specified keyfile could not be found: ${KEYFILE}"; exit; fi

# use a working directory
if [[ ! -d ries ]]; then mkdir ries; fi
cd ries

# download and install the app
if [[ ! -f latest.zip ]]; then curl https://storage.googleapis.com/rt-era-public/code/release/ries/latest.zip -o latest.zip; fi
unzip -u latest.zip
npm install -g pnpm
pnpm install
pnpm audit

# link in the keyfile and test it
if [[ ! -L code/.keyfile ]]; then ln -s $KEYFILE code/.keyfile; fi
#node code/utilities/test_config.js

# compile everything
#node code/cli/compile_all.js
