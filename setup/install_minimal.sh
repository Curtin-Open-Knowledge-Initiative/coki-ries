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

# after exporting an access keyfile from your BigQuery console, link it in
ln -s /path/to/your/keyfile setup/.access.json

# OPTIONAL: create and configure a config file
cp setup/example_config.json setup/.config.json && nano setup/.config.json

# test your configuration
node . config_test

# compile everything
node . compile_all
