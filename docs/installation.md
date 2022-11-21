# Installation

The application requires either [Docker] or [NodeJS] with various command line tools. If you wish to run queries and build an online database then you will also require access to a [Google BigQuery][BigQuery] instance (details below).

## Option 1 - install with docker

Requirements: docker

```bash
# pull the latest image and test a container by printing the help
docker run --rm observatoryacademy/coki-ries:latest node . ?

# OPTIONAL: tag the image for easier reference
docker tag observatoryacademy/coki-ries:latest ries

# OPTIONAL: bind mount your keyfile (see below) and test the connection
docker run --rm \
  --volume /path/to/your/keyfile:/app/setup/.keyfile.json \
ries node . config_test
```

## Option 2 - install with bash script (unix-like systems)

Requirements: curl, bash

```bash
# get the script
curl https://raw.githubusercontent.com/Curtin-Open-Knowledge-Initiative/coki-ries/main/setup/install_nix.bash -o install.bash 

# run it (keyfile is optional)
bash install.bash [<path_to_keyfile>]
```

## Option 3 - install manually (unix-like systems)

Requirement: a CLI package manager such as apk, apt or brew.

```bash
# change this to suit the package management for your *nix variant (brew, rpm, apt, etc)
apk update
apk upgrade
apk add git unzip curl nodejs npm

# clone the repo and enter the directory
git clone https://github.com/Curtin-Open-Knowledge-Initiative/coki-ries
cd coki-ries

# install node dependencies
npm install -g pnpm
pnpm install
pnpm audit

# test by printing the help
node . ?

# OPTIONAL: symlink your keyfile and test the connection
ln -s /path/to/your/keyfile.json setup/.keyfile.json
node . config_test

# OPTIONAL: create your own default configuration
cp setup/example_config.json setup/.config.json
nano setup/.config.json
```

## Obtain a BigQuery keyfile (optional)

Skip this section if you do not intend to build a demo database instance.

To build a database, the application requires access an existing [BigQuery] instance via a [credentials keyfile][keyfile]. Contact your GCloud administrator to assist you in exporting a keyfile from [Google Cloud IAM][IAM] then store it in a safe place.

For security, it is advisable to create a new project for this application to use. Within the project's scope, the following permissions should be assigned to a role or application user:

* storage.buckets.get
* storage.objects.get
* storage.objects.list
* bigquery.datasets.create
* bigquery.tables.create
* bigquery.tables.updateData
* bigquery.tables.update
* bigquery.jobs.create

Once you have your [keyfile], store it in a safe location outside the project directory (to avoid accidentally committing it to version control). You can symlink it to a local installation, or bind-mount it to a docker container. The [keyfile] should be in [JSON] format and should look something like this:

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

## Create a default configuration file (optional)

Skip this section if you're happy to define options at the command line, or if the default configuration values are acceptable (see [configuration] for more information)

```bash
echo '{
  "keyfile" : "your-keyfile",
  "project" : "your-project",
  "dataset" : "your_dataset",
  "replace" : false,
  "verbose" : false,
  "dryrun"  : false
  "start"   : 1500,
  "finish"  : 2200,
  "rorcode" : "https://ror.org/02n415q13"
}' >> config.json
```

[Docker]: <https://www.docker.com/>
[NodeJS]: <https://nodejs.org/en/download/>
[BigQuery]: <https://cloud.google.com/bigquery/>
[IAM]: <https://cloud.google.com/iam>
[keyfile]: <https://cloud.google.com/bigquery/docs/authentication/service-account-file>
[JSON]: <https://www.json.org/json-en.html>
[configuration]: <configuration.md>