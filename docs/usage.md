# Usage

## Docker

If using docker, you can either invoke a command directly or enter an interactive container:

```bash

# single-use invocation (in this case print help)
docker run --rm -it cokicurtin/ries:latest node . --help

# interactive container
docker run --rm -it cokicurtin/ries:latest sh
node . --help
exit

# for certain commands, you may want to bind-mount an access file, config file and/or data directory
docker run --rm -it --name ries \
  --volume your_access_file:/app/setup/.access.json \
  --volume your_config_file:/app/setup/.config.json \
  --volume your_data_folder:/app/data \
cokicurtin/ries:latest sh
node config_test
exit

```

## Usage Examples

These examples assume you're in the app's root directory (either locally or in a docker container).

```bash
# print short help information
node .

# print full help information
node . -h

# print the current configuration
node . config_print

# see the effect of providing config options at the command line
node . config_print \
  --test1 "value" \
  --test2 false \
  --test3 \
  --test4 100 \
  --test5 [1,2,3] \
  --test6 '"[1,2,3]"' \
  --test7 '{"key":"value"}' \
a b c 1 2 3

# test if the app can connect to a BigQuery database
node . config_test

# test if the app can connect using a keyfile and dataset that you provide with the command
node . config_test --keyfile=/my/keyfile.json --dataset='my-dataset'

# example changing all core config options
node . config_print \
  --keyfile /path/to/my/keyfile.json \
  --bucket 'gs://coki-bucket' \
  --project 'MY-PROJECT' \
  --dataset 'MY-DATASET' \
  --replace true \
  --verbose false \
  --dryrun   \
  --docache  \
  --debug   true
  --start 1900,
  --finish 2020,
  --rorcode 'https://www.ror.org/my-inst-code'

# get a list of individual queries (by ID and name)
node . query_list

# compile and print SQL for a specific query (by ID or name)
node . query_print 25
node . query_print raw_journals

# invoke a specific SQL query (by ID or name, don't forget to add required parameters if needed)
node . query_run 21
node . query_run ping

# show workflow diagrams
node . plot_workflow
node . plot_workflow_core

# compile all SQL and print it out (--verbose) without executing it (--dryrun)
node . compile_all --dryrun --verbose

# build the whole database using settings from a custom config file
node . compile_all --config /my/config.json

# generate output tables for a specific institutino
node . analyse_institution --replace --rorcode='https://ror.org/02n415q13'

# generate analysis for a particular time frame
node . analyse_era --start=2011 --finish=2016
```

## Command Line Interface

Access the CLI instructions by running `node . help` from within the project directory or, explicitly `node /path/to/app.js help`

```docs

# RIES Command Line Interface

Run various RIES tasks from the command line

Version: 1.0.0

Usage:
  ries version
  ries usage
  ries help
  ries options
  ries test_config         [options]
  ries test_access         [options]
  ries plot_workflow_core  [options]
  ries plot_workflow       [options]
  ries query_list          [options]
  ries query_print         [options] <id>
  ries query_run           [options] <id>
  ries analyse_institution [options] --rorcode=<url>
  ries analyse_topic       [options] --topic=<int>
  ries analyse_era         [options] --start=<int> --finish=<int>
  ries compile_raw         [options]
  ries compile_core        [options]
  ries compile_benchmarks  [options]
  ries compile_indicators  [options]
  ries compile_all         [options]
  
Options:
  --confile=<str>   Path to a JSON file that contains these config options as an object.
  --keyfile=<str>   Path to a JSON file that contains your BigQuery access credentials.
  --project=<str>   The name of your BigQuery project.
  --dataset=<str>   The name of your BigQuery dataset.
  --bucket=<str>    Name of the COKI public Google Cloud bucket.
  --replace         Overwrite existing tables.
  --verbose         Print SQL queries to the command line as they are generated.
  --dryrun          Print SQL queries but don't execute them.
  --docache         Use the query cache to avoid repeating queries.
  --debug           Print some debugging information, such as config settings.
  --start=<int>     Start analysis at this year (inclusive).
  --finish=<int>    Finish analysis at this year (inclusive).
  --rorcode=<url>   The Research Organization Registry URL of your institution.

Functions:
  version             - Print the current version.
  usage               - Print basic usage information (the default).
  help                - Print full help information.
  options             - Print information about command line options.
  test_config         - Verify and print the current configuration settings as a JSON object.
  test_access         - Attempt to connect to the specified BigQuery database.
  plot_workflow_core  - (Re)generate a Mermaid plot for the core workflow.
  plot_workflow       - (Re)generate a Mermaid plot for the database build process.
  query_list          - Print a list of all available queries.
  query_print         - Compile a query and print the SQL to the screen without running it.
  query_run           - Compile a query and run it.
  analyse_institution - (Re)generate a report for a single research organisation.
  analyse_topic       - (Re)generate a report for a particular field of research .
  analyse_era         - (Re)generate a report for a given ERA time period.
  compile_raw         - (Re)compile only the `raw` tables in the database by importing data from the COKI bucket.
  compile_core        - (Re)compile only the `core` tables in the database, to suit your analysis.
  compile_benchmarks  - (Re)compile only the `benchmark` tables in the database.
  compile_indicators  - (Re)compile only the `indicator` tables in the database.
  compile_all         - (Re)compile all tables in the database.

```

## Arguments

You can override any of these at the command line using `--arg=value` syntax:

```markdown
--keyfile=<str>
  The location of your BigQuery keyfile.

--bucket=<str>
  Name of the COKI public Google Cloud bucket.

--project=<str>
  The name of your BigQuery project.

--dataset=<str>
  The name of your BigQuery dataset.

--replace=<bool>
  Overwrite existing tables.

--verbose=<bool>
  Print SQL queries to the command line as they are generated.

--dryrun=<bool>
  Print SQL queries but don't execute them.

--start=<int>
  Start analysis at this year.

--finish=<int>
  Finish analysis at this year.

--rorcode=<url>
  The Research Organization Registry URL of your institution.
```

## Available Functions

```text

test_config         
  Verify and print the current configuration settings as a JSON object.

test_access         
  Attempt to connect to the specified BigQuery database.

plot_workflow_core  
  (Re)generate a Mermaid plot for the core workflow.

plot_workflow       
  (Re)generate a Mermaid plot for the database build process.

query_list          
  Print a list of all available queries.

query_print <id>
  Compile a query and print the SQL to the screen without running it.

query_run <id>
  Compile a query and run it.

analyse_institution --rorcode=<url>
  (Re)generate a report for a single research organisation.

analyse_topic --field=<int>
  (Re)generate a report for a particular field of research .

analyse_era --start=<int> --finish=<int>
  (Re)generate a report for a given ERA time period.

compile_raw         
  (Re)compile only the `raw` tables in the database by importing data from the COKI bucket.

compile_core        
  (Re)compile only the `core` tables in the database, to suit your analysis.

compile_benchmarks  
  (Re)compile only the `benchmark` tables in the database.

compile_indicators  
  (Re)compile only the `indicator` tables in the database.

compile_all         
  (Re)compile all tables in the database.

```

## Compiling Queries

Each of the queries in `/code/queries` can be invoked directly at the command line instead of using the main CLI. Unless overridden by the user (file or CLI), the default behaviour is to print the SQL but not run it.

```bash
# these are equivalent for printing a query
node . query_print benchmark_cpp
node code/queries/benchmark_cpp --verbose true --dryrun true

# these are equivalent for running a query
node . query_run benchmark_cpp
node code/queries/benchmark_cpp --verbose=true --dryrun=false
```
