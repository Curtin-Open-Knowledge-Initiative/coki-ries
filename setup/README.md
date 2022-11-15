# ./setup

This directory contains various installation scripts and your configuration settings.

The application expects to find two files here that configure your instance:

- `.keyfile.json` - access credentials for your BigQuery instance.
- `.config.json` - your preferred default settings for the application.

**IMPORTANT**: Ensure that your files are not under version control (verify that they are excluded by .gitignore). Your keyfile should be a symlink.

Once you have these files in place, ping your database to test the configuration:

```bash
npm run ping
```

## Installation

Documentation: [../docs/installation.md][inst]

## Configuration

Documentation: [../docs/configuration.md][conf]

[inst]: <../docs/installation.md>
[conf]: <../docs/configuration.md>

## Files

- [./Dockerfile](./Dockerfile) used to build the app image
- [./docker_build.bash](./docker_build.bash) - command to build the docker image
- [./docker_run.bash](./docker_run.bash) - command to run a docker container
- [./docker_test.bash](./docker_test.bash) - command to test configuration with a docker container
- [./example_config.js](./example_config.js) - a fully documented example config file
- [./example_config.json](./example_config.json) - an undocumented example config file
- [./example_keyfile.json](./example_keyfile.json) - an example access keyfile
- [./install_docker.bash](./install_docker.bash) - script that can be used within a docker container to install the app
- [./install_linux.sh](./install_linux.sh) - script to install the app on a Linux system
- [./install_osx.bash](./install_osx.bash) - script to install the app on a Mac OS X system
