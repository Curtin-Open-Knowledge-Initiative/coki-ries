# Usage

CLI instructions

```docs

# RIES Command Line Interface

Run various RIES tasks from the command line

Usage:
  cli analyse_era         [options] --start=<int> --finish=<int>
  cli analyse_institution [options] --rorcode=<url>
  cli analyse_topic       [options] --topic=<int>
  cli compile_all         [options]
  cli compile_benchmarks  [options]
  cli compile_core        [options]
  cli compile_indicators  [options]
  cli compile_raw         [options]
  cli plot_workflow       [options]
  cli plot_workflow_core  [options]
  cli query_exec          [options] <id>
  cli query_list          [options]
  cli query_print         [options] <id>
  cli test_config         [options]
  cli [options]

Options:
  --help, -h        Show this help message
  --version, -v     Current version
  --keyfile=<str>   The location of your BigQuery keyfile.
  --bucket=<str>    Name of the COKI public Google Cloud bucket.
  --project=<str>   The name of your BigQuery project.
  --dataset=<str>   The name of your BigQuery dataset.
  --replace         Overwrite existing tables.
  --verbose         Print SQL queries to the command line as they are generated.
  --dryrun          Print SQL queries but don't execute them.
  --docache         Use the query cache to avoid repeating queries.
  --debug           Print some debugging information, such as config settings.
  --start=<int>     Start analysis at this year.
  --finish=<int>    Finish analysis at this year.
  --rorcode=<url>   The Research Organization Registry URL of your institution.
  <id>              The query ID, either an integer or a name.

Functions:
  analyse_era         - (Re)generate a report for a given ERA time period.
  analyse_institution - (Re)generate a report for a single research organisation.
  analyse_topic       - (Re)generate a report for a particular field of research .
  compile_all         - (Re)compile all tables in the database
  compile_benchmarks  - (Re)compile only the `benchmark` tables in the database.
  compile_core        - (Re)compile only the `core` tables in the database, to suit your analysis.
  compile_indicators  - (Re)compile only the `indicator` tables in the database.
  compile_raw         - (Re)compile only the `raw` tables in the database by importing data from the COKI bucket.
  plot_workflow       - (Re)generate a Mermaid plot for the database build process.
  plot_workflow_core  - (Re)generate a Mermaid plot for the core workflow.
  query_exec          - Compile a query and run it.
  query_list          - Print a list of all available queries.
  query_print         - Compile a query and print the SQL to the screen without running it.
  test_config         - Check if the default config is valid and the app can connect to your database.
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

--yr-from=<int>
  Start analysis at this year.

--yr-to=<int>
  Finish analysis at this year.

--ror-url=<url>
  The Research Organization Registry URL of your institution.
```

## Available Functions

```text

analyse_era --year-from=<int> --year-to<int>
  (Re)generate a report for a given ERA time period.

analyse_institution --institution=<url>
  (Re)generate a report for a single research organisation.

analyse_topic --field=<int>
  (Re)generate a report for a particular field of research .

compile_all
  (Re)compile all tables in the database

compile_benchmarks
  (Re)compile only the `benchmark` tables in the database.

compile_core
  (Re)compile only the `core` tables in the database, to suit your analysis.

compile_indicators
  (Re)compile only the `indicator` tables in the database.

compile_raw
  (Re)compile only the `raw` tables in the database by importing data from the COKI bucket.

plot_workflow
  (Re)generate a Mermaid plot for the database build process.

plot_workflow_core
  (Re)generate a Mermaid plot for the core workflow.

query_exec --name=<str>
  Compile a query and run it.

query_list
  Print a list of all available queries.

query_print --name=<str>
  Compile a query and print the SQL to the screen without running it.

test_config
  Check if the default config is valid and the app can connect to your database.
```

## Examples

```bash
cd this_app
node . compile_all --project='my-project' --dryrun=true --silent=false
node . report --replace=true --start=2011 --finish=2016
node . report_institution --replace=true --ror_url='https://ror.org/02n415q13'
```
