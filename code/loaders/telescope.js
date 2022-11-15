/*
## Summary
Run ETL scripts to (re)build the raw data tables.

## Description

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const app = require('app');

async function run_all(conf) {
  await app.query(`CREATE SCHEMA IF NOT EXISTS \`${conf.ns_core}\``);
  await require('./telescope_coki')         (conf);
  await require('./telescope_era_history')  (conf);
  await require('./telescope_forcodes_2008')(conf);
  await require('./telescope_forcodes_2020')(conf);
  await require('./telescope_forcodes')     (conf);
  await require('./telescope_heps')         (conf);
  await require('./telescope_issns')        (conf);
  await require('./telescope_journals_2018')(conf);
  await require('./telescope_journals_2023')(conf);
  await require('./telescope_rors')         (conf);
}
module.exports = run_all;

if (require.main === module) {
  run_all(app.conf());
}
