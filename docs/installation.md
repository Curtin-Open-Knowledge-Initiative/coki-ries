# Installation

The application can be run from a Docker container or installed locally. Either way, it will require access to BigQuery. You do not need to clone this repo from GitHub to run the application.

## Obtain a BigQuery Keyfile

This application requires access to an existing [Google BigQuery][google_bigquery] instance via a [credentials keyfile][google_keyfile]. Keyfiles can be exported from [Google Cloud IAM][google_iam]; contact your GCloud administrator for assistance.

For security, your administrator is advised to create a new project for this application to use. Within the project, the following permissions should be assigned:

* storage.buckets.get
* storage.objects.get
* storage.objects.list
* bigquery.datasets.create
* bigquery.tables.create
* bigquery.tables.updateData
* bigquery.tables.update
* bigquery.jobs.create

Once you have your keyfile, store it in a safe location outside the project directory (to avoid accidentally committing it to version control). The keyfile should be in JSON format and look something like this:

```json
{
  "type": "YOUR GCLOUD ACCOUNT TYPE",
  "project_id": "YOUR PROJECT ID",
  "private_key_id": "YOUR KEY ID",
  "private_key": "-----BEGIN PRIVATE KEY----- YOUR KEY TEXT -----END PRIVATE KEY-----\n",
  "client_email": "YOUR GCLOUD EMAIL ADDRESS",
  "client_id": "YOUR GCLOUD USER ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/YOUR CERTIFICATE ADDRESS"
}
```

## Option 1 - Docker + install script

Requirements: keyfile.json, bash, curl, docker

```bash
curl https://storage.googleapis.com/rt-era-public/code/release/ries/install_docker.bash -o install.bash
bash install.bash /path/to/your/keyfile.json
```

## Option 2 - Unix-like system + install script

Requirements: keyfile.json, bash, curl, nodejs, npm (an attempt will be made to auto-install these if missing)

```bash
curl https://storage.googleapis.com/rt-era-public/code/release/ries/install_nix.bash -o install.bash
bash install.bash /path/to/your/keyfile.json
```

## Option 3 - Manual Install

Substitute `apk` for your package manager (eg `brew` on OS X)

```bash
# change this to suit the package management for your *nix variant (brew, rpm, apt, etc)
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
ln -s /your/bigquery/keyfile.json setup/.keyfile.json

# set up your default config file
cp setup/example_config.json setup/.config.json
nano setup/.config.json

# test your configuration
npm run ping

# compile everything
npm run cli -- compile_all
```

## Option 4 - Docker

Check that you have docker available at the command line: `which docker && docker--version`. You do not have to clone this repo to run the app with docker.

Create a local working directory with the directories and files you'll want to mount into the container.

```bash
mkdir ries && cd ries
mkdir conf data

# symlink your keyfile
ln -s /your/keyfile.json ./conf/.keyfile.json

# set up your default config
curl https://storage.googleapis.com/rt-era-public/code/release/ries/example_config.json -o conf/.config.json
nano conf/.config.json

# OPTIONAL: download some docker helpers
curl https://storage.googleapis.com/rt-era-public/code/release/ries/setup/docker_build.bash
curl https://storage.googleapis.com/rt-era-public/code/release/ries/setup/docker_start.bash
```

Now you can build the image and launch containers, mounting in your directories.

If you downloaded the docker helpers:

```bash
bash docker_build.bash     # build the image
bash docker_start.bash     # launch a container
npm run ping               # test connection
npm run cli -- compile_all # build the database
exit
```

If you did not download the helpers, run the docker commands manually:

```bash
# build the image (named coki:latest)
docker build --tag coki:latest --no-cache .

# enter the container and build the database (data bindmount is optional)
docker run --rm \
  --volume ${PWD}/conf:/app/setup \
  --volume ${PWD}/data:/app/data \
coki:latest sh
npm run ping
npm run cli -- compile_all
exit
```

[google_bigquery]: <https://cloud.google.com/bigquery>
[google_iam]: <https://cloud.google.com/iam>
[google_keyfile]: <https://cloud.google.com/bigquery/docs/authentication/service-account-file>
