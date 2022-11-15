# Command Line Utilities

Various actions that can be run from the command line or imported as library functions.

| script | description |
| - | - |
| analyse_institution.js | Builds all tables required to conduct a single-institution analysis. Requires `benchmarks_create.js`. |
| benchmarks_create.js   | Builds all tables required for benchmarking and analysis. Requires `run_telescopes.js` to have been run first. |
| benchmarks_delete.js   | Removes all tables built by `benchmarks_create.js`. |
| cli_launch.js          | Run the command line interface. |
| plot_indicator.js      | TODO: rebuild and show a plot for a specific ERA-like indicator. |
| plot_workflow.js       | Rebuild and show (in Electron) a Mermaid plot for the overall workflow. |
| plot_workflow_core.js  | Rebuild and show a Mermaid plot of the project at a higher (abstract) level. |
| query_compile.js       | Given the name of a pre-canned query (in the `./sql/templated` directory), compile and print the SQL for it. |
| query_execute.js       | Given the name of a pre-canned query, (re)run it in Google BigQuery. |
| telescopes_run.js      | Run all ETL scripts to extract data from primary sources and rebuild `raw` tables. |

## Command Line Documentation

# RIES CLI Documentation

Run various RIES tasks from the command line.

---

## Default Arguments

By default, all CLI actions will use the arguments that are specified in your `config.json` file. If you haven't created this file, then the defaults will be:

```bash
{
  keyfile : "apphome/conf/.keyfile.json"
  bucket  : "rt-era-public"
  project : keyfile -> project-id
  dataset : "demo"
  replace : false
  verbose : false
  dryrun  : false
  yr-from : 0
  yr-to   : 2200
  ror-url : ""
}
```

---

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

---

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
