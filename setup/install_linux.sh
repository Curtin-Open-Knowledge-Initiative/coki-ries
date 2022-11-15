# change this to suit the package management for your unix variant (brew, rpm, apt, etc)
apk update && apk upgrade
apk add unzip curl git nano nodejs npm

# set to your desired install location
DIR=~/ries
mkdir -p $DIR && cd $DIR
curl https://storage.googleapis.com/rt-era-public/code/release/ries/latest.zip -o code.zip
unzip code.zip && rm code.zip

# install node dependencies
npm install -g pnpm && pnpm install && pnpm audit

# after exporting a credentials file from your BigQuery console, link it in
ln -s <YOUR_CREDENTIALS_FILE> conf/credentials.json

# after setting up a config file, copy it in
cp <YOUR_CONFIG_FILE> conf/config.js

# test your configuration
node code/cli/test_config.js

# compile everything
node code/cli/compile_all.js
