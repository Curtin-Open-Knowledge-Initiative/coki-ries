#!/bin/bash

# check that the user provided a keyfile as the first parameter
if [[ ! $1 ]]; then echo "ERROR: you need to provide the path to your keyfile as the first parameter"; exit; fi
KEYFILE="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
if [[ ! -f $KEYFILE ]]; then echo "ERROR: the specified keyfile could not be found: ${KEYFILE}"; exit; fi

# check dependencies
echo "Checking dependencies:"

# if homebrew is available
if [[ ! -z `which brew` ]]; then
  if [[ -z `which unzip` ]]; then brew update && brew upgrade && brew install unzip; fi
  if [[ -z `which curl`  ]]; then brew update && brew upgrade && brew install curl ; fi
  if [[ -z `which node`  ]]; then brew update && brew upgrade && brew install node ; fi
  if [[ -z `which npm`   ]]; then brew update && brew upgrade && brew install npm  ; fi
# else if apk is available
elif [[ ! -z `which apk` ]]; then
  if [[ -z `which unzip` ]]; then apk update && apk upgrade && apk add unzip ; fi
  if [[ -z `which curl`  ]]; then apk update && apk upgrade && apk add curl  ; fi
  if [[ -z `which node`  ]]; then apk update && apk upgrade && apk add nodejs; fi
  if [[ -z `which npm`   ]]; then apk update && apk upgrade && apk add npm   ; fi
fi

if [[ -z `which unzip` ]]; then echo 'ERROR: this script requires `unzip` at the command line. Please install it with your package manager'; exit; fi
if [[ -z `which curl`  ]]; then echo 'ERROR: this script requires `curl`  at the command line. Please install it with your package manager'; exit; fi
if [[ -z `which node`  ]]; then echo 'ERROR: this script requires `node`  at the command line. Please install it with your package manager'; exit; fi
if [[ -z `which npm`   ]]; then echo 'ERROR: this script requires `npm`   at the command line. Please install it with your package manager'; exit; fi

echo " - found curl"
echo " - found unzip"
echo " - found node: `node --version`"
echo " - found npm: `npm --version`"

# use a working directory
if [[ ! -d ries ]]; then mkdir ries; fi
cd ries

# download and install the app
if [[ ! -f latest.zip ]]; then 
  echo "Fetching latest version:"
  curl https://storage.googleapis.com/rt-era-public/code/release/ries/latest.zip -o latest.zip
fi

echo "Extracting:"
unzip -u latest.zip

echo "Updating packages:"
npm install -g pnpm
pnpm install

echo "Auditing packages:"
pnpm audit

# set up the symlink to the provided keyfile
echo "Linking keyfile:"
if [[ ! -L setup/.keyfile.json ]]; then ln -s $KEYFILE setup/.keyfile.json; fi
if [[ ! -L setup/.keyfile.json ]]; then 
  echo "ERROR: unable to create a symlink to keyfile: $KEYFILE"; exit; 
else
  echo "Success"
fi

echo "Default settings:"
node code/utilities/config_print

echo "Testing connection:"
node code/utilities/config_test

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
