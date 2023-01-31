# Configuration

When running, the application makes use of settings with the following priority (low to high):

1. default settings
2. user-defined settings in `setup/.config.json` (overrides #1)
3. user-defined settings at the command line using `--key=val` parameters (overrides #2)
4. program-defined settings locked to certain function calls (overrides #3)

## Available Settings

These are the available settings (key-pairs). Additional settings may be added to the settings object and they will be passed through as-is. All settings may be overridden at the command line by prefixing with a double dash, for example `--start 2010` or `--start=2010`

| name | type | description |
| - | - | - |
| keyfile | filepath | Path to your BigQuery keyfile. |
| bucket  | text | Name of the COKI public Google Cloud bucket. |
| project | text | The name of your BigQuery project. |
| dataset | text | The name of your BigQuery dataset. |
| replace | boolean | Overwrite existing tables when compiling. |
| verbose | boolean | Print SQL queries to the command line as they are generated. |
| dryrun  | boolean | Print SQL queries but don't execute them. |
| start   | integer | Start analysis at this year (inclusive). |
| finish  | integer | Finish analysis at this year (inclusive). |
| rorcode | url | The Research Organization Registry URL of your institution. |
| ...     | any | You can add any other values, they will be passed through as-is

## 1. Default Settings

If no settings are provided by the user then these are the baseline defaults:

```js
{
  "keyfile" : "../setup/.keyfile.json",
  "bucket"  : "gs://rt-era-public",
  "project" : "<read_from_keyfile>",
  "dataset" : "ries_demo",
  "replace" : false,
  "verbose" : false,
  "dryrun"  : false
  "start"   : 1500,
  "finish"  : 2200,
  "rorcode" : "https://ror.org/02n415q13"
}
```

## 2. Config File

If a config file is located at `setup/.config.json`, then the settings in that file will override the defaults above. Any additional keys (that do not intersect with default keys), will be ignored and passed through. To keep the default value, just exclude a key from the file:

In this example, the `.config.json` file skips institutional analysis, prints all queries, and has a more restricted time range.

```js
{
  "verbose" : true,
  "start"   : 2011,
  "finish"  : 2016,
  "rorcode" : ""
}
```

## 3. Command Line Arguments

You can override an argument at the command line using `--arg=value` syntax. Note that for boolean values, you must specify `--name false` to negate a value that is defaulting to true.

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

## 4. Function Calls

Inside the application, many functions take an `args` object as input. In some instances, settings may be forcefully overridden at this stage. For example, when calling `app.query_print(args)`, the value of `dryrun` will always be set to `true`.

## Command Line Interface (CLI)

The command line interface may be launched from anywhere within the project by running `npm run cli` or specifically: `node code/app.js`. To see the CLI help information:

```bash
npm run cli help
 
OR

node . help
```

```docs

# RIES Command Line Interface

Run various RIES tasks from the command line

Usage:
  ries analyse_era         [options] --start=<int> --finish=<int>
  ries analyse_institution [options] --rorcode=<url>
  ries analyse_topic       [options] --topic=<int>
  ries compile_all         [options]
  ries compile_benchmarks  [options]
  ries compile_core        [options]
  ries compile_indicators  [options]
  ries compile_raw         [options]
  ries plot_workflow       [options]
  ries plot_workflow_core  [options]
  ries query_run           [options] <id>
  ries query_list          [options]
  ries query_print         [options] <id>
  ries test_config         [options]
  ries [options]

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
  query_run           - Compile a query and run it.
  query_list          - Print a list of all available queries.
  query_print         - Compile a query and print the SQL to the screen without running it.
  test_config         - Check if the default config is valid and the app can connect to your database.
```
