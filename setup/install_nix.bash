#!/bin/bash

# check dependencies using a local package manager if available
if   [[ ! -z `which brew` ]]; then brew install git unzip curl node   npm
elif [[ ! -z `which apt`  ]]; then apt  add     git unzip curl nodejs npm
elif [[ ! -z `which apk`  ]]; then apk  add     git unzip curl nodejs npm
fi

# abort if dependencies aren't found
if [[ -z `which git`   ]]; then echo 'ERROR: `git`   not found. Please install it with your package manager'; exit; fi
if [[ -z `which unzip` ]]; then echo 'ERROR: `unzip` not found. Please install it with your package manager'; exit; fi
if [[ -z `which curl`  ]]; then echo 'ERROR: `curl`  not found. Please install it with your package manager'; exit; fi
if [[ -z `which node`  ]]; then echo 'ERROR: `node`  not found. Please install it with your package manager'; exit; fi
if [[ -z `which npm`   ]]; then echo 'ERROR: `npm`   not found. Please install it with your package manager'; exit; fi

# clone the repo
git clone https://github.com/Curtin-Open-Knowledge-Initiative/coki-ries.git && cd coki-ries

# install and audit package dependencies
npm install -g pnpm && pnpm install && pnpm audit

echo "Default settings:"
node code/utilities/config_print

# if a keyfile has been provided then link it in
if [[ ! $1 ]]; then 
  KEYFILE="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
  echo "Attempting to link keyfile: $KEYFILE"
  if [[ ! -f $KEYFILE ]]; then echo "FAILURE: keyfile not found"; exit; fi
  if [[ ! -L setup/.keyfile.json ]]; then ln -s $KEYFILE setup/.keyfile.json; fi
  if [[ ! -L setup/.keyfile.json ]]; then echo "FAILURE: unable to create link"; exit; fi
  echo "SUCCESS: created link to keyfile"
  echo "Testing connection:"
  node code/utilities/config_test
fi







echo "Testing generation of default SQL:"
node code/utilities/compile_all --dryrun --verbose

echo "Showing instructions:"
node . --help

# suggest that a config be created
if [[ ! -f setup/.config.json ]]; then 
  cp setup/example_config.json setup/.config.json
  echo "Check your CONFIG settings at ./ries/setup/.config.json"
fi

# compile everything
echo "Once you are happy that everything is correct, then build the database with:"
echo "> node code/utilities/compile_all"
