# ./code/loaders

This directory contains primary ETL scripts (COKI refers to these as 'telescopes'). Each script connects to an external source of raw data, converts data into JSONL format, then creates and populates an equivalent BigQuery table. It is not required that you run these scripts yourself, as COKI has already done so, with the JSONL output files being hosted for you in the COKI public GCS bucket. Within the `./code/queries` directory, the `raw_*` series of queries import data from the hosted public files. 

If you run the scripts in this directory, then your `raw_*` tables will be replaced.

| file | description |
| - | - |
| telescope.js               | generic ETL functionality, used by other scripts |
| telescope_coki.js          | Imports a sample set of COKI data from 2016 |
| telescope_era_history.js   | Imports previous ERA ratings from https://dataportal.arc.gov.au |
| telescope_forcodes_2008.js | Imports ANZSRC 2008 FoR codes from www.abs.gov.au |
| telescope_forcodes_2020.js | Imports ANZSRC 2020 FoR codes from http://aria.stats.govt.nz |
| telescope_forcodes.js      | Combines the above two importers |
| telescope_heps.js          | Imports a static set of higher-education providers sourced from the ARC |
| telescope_issns.js         | Imports an ISSN <-> ISSN-L mapping from https://www.issn.org |
| telescope_journals_2018.js | Imports the ERA 2018 Journal List from https://web.archive.org.au |
| telescope_journals_2023.js | Imports the ERA 2023 Journal List from https://www.arc.gov.au/ |
| telescope_rors.js          | Imports the Research Organisation Registry list from https://zenodo.org |

## Usage

Any of these scripts can be run directly from the command line. There is not currently an option to run them via the CLI as users are encouraged to make use of the GCS cache instead.

```bash
node ./code/loaders/telescope_NAME.js
```
