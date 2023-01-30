/*
## Summary
Run all compile scripts, according to a configuration script.

## Description
Control the run process by building a configuration object (see /conf/README). If using the default 
configuration, the script will patch the database, rebuilding any tables that are missing but not 
altering existing tables. It will then generate analysis using the ERA 2023 configuration.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
function compile_all(conf = {}) {
  const queries = [];
  require('./compile_raw')        (conf).forEach(q => queries.push(q));
  require('./compile_core')       (conf).forEach(q => queries.push(q));
  require('./compile_benchmarks') (conf).forEach(q => queries.push(q));
  require('./compile_indicators') (conf).forEach(q => queries.push(q));
  require('./analyse_institution')(conf).forEach(q => queries.push(q));
  //require('./analyse_topic')      (conf).forEach(q => queries.push(q));
  //require('./analyse_era.js')     (conf).forEach(q => queries.push(q));
  return queries;
}
module.exports = compile_all;
if (require.main === module) require('app').cli_compile(module.exports);
