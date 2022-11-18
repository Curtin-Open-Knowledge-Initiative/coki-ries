/*
## Summary
Build the raw data tables by loading in ETL-generated data from the COKI public data bucket

## Description
The COKI team run a series of ETL scripts that periodically pull data from external data providers. 
For use with this application, the datasets are transformed into a compatible form then deposited 
in a publicly accessible GCloud bucket. This scripts creates tables in your BigQuery dataset and 
loads in the raw data from the COKI bucket.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const app = require('app');

// build the core tables
function compile_raw(conf={}) {
  return [`
    -------------------------------------------------------------------------------
    -- WARNING: these queries are machine-generated. Any changes that you make   --
    -- here will be overwritten on the next compilation. If a permanent query    --
    -- alteration is required then modify the files in /code/queries/            --
    -------------------------------------------------------------------------------
    -- generated by: ${__filename}
    CREATE SCHEMA IF NOT EXISTS \`${conf.ns_core}\`;
    `,
    require('../queries/raw_rors'    ).compile(conf),
    require('../queries/raw_issns'   ).compile(conf),
    require('../queries/raw_heps'    ).compile(conf),
    require('../queries/raw_history' ).compile(conf),
    require('../queries/raw_topics'  ).compile(conf),
    require('../queries/raw_journals').compile(conf),
    require('../queries/raw_papers'  ).compile(conf),
  ];
}
module.exports = compile_raw;

if (require.main === module) {
  (async () => { for (let sql of module.exports(app.conf())) await app.query(sql); })()
}
