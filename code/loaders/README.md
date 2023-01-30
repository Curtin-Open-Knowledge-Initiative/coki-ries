# ./code/loaders

This directory contains primary ETL scripts (COKI refers to these as 'telescopes'). Each script connects to a third-party source of raw data, downloads files, transforms into JSONL format, then creates and populates a BigQuery table (assuming you have provided connection details to your database instance).

It is not a requirement that you run these scripts, as COKI has already done so and provides a set of prebuilt files at: <https://www.tinyurl.com/ries-data>.

If you do run these scripts, then be advised that your `raw_*` tables in BigQuery will be replaced should they already exist.

| file | description |
| - | - |
| telescope.js               | Generic ETL functionality, used by other scripts |
| telescope_coki.js          | Imports a sample set of COKI data from 2016 |
| telescope_era_history.js   | Imports previous ERA ratings from <https://dataportal.arc.gov.au> |
| telescope_forcodes_2008.js | Imports ANZSRC 2008 FoR codes from <https://www.abs.gov.au> |
| telescope_forcodes_2020.js | Imports ANZSRC 2020 FoR codes from <http://aria.stats.govt.nz> |
| telescope_forcodes.js      | Combines the above two importers |
| telescope_heps.js          | Imports a static set of higher-education providers sourced from the ARC |
| telescope_issns.js         | Imports an ISSN <-> ISSN-L mapping from <https://www.issn.org> |
| telescope_journals_2018.js | Imports the ERA 2018 Journal List from <https://web.archive.org.au> |
| telescope_journals_2023.js | Imports the ERA 2023 Journal List from <https://www.arc.gov.au> |
| telescope_rors.js          | Imports the Research Organisation Registry list from <https://zenodo.org> |

If you don't want to run these build scripts, there is another series of `raw_*` query files located within the `./code/queries` directory. These scripts will automatically load data from the prebuilt data files into your BigQuery instance.

## Usage

These ETL scripts can be run manually from the command line as shown below (see the main docs for --config options).

```text
node ./code/loaders/telescope_<name>.js
```
