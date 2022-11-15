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
const app = require('app');

async function compile_all(conf = {}) {
  const queries = [`
    -------------------------------------------------------------------------------
    -- WARNING: these queries are machine-generated. Any changes that you make   --
    -- here will be overwritten on the next compilation. If a permanent query    --
    -- alteration is required then modify the files in /code/queries/            --
    -------------------------------------------------------------------------------
    -- generated by: ${__filename}
    CREATE SCHEMA IF NOT EXISTS \`${conf.ns_core}\`;
  `];
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

if (require.main === module) {
  async function run_queries(conf) {
    const queries = await compile_all(conf);
    for (let sql of queries) {
      if (conf.verbose) console.log(sql);
      if (conf.dryrun) continue;
      await app.query(sql);
    }
  }  
  run_queries(app.conf());
}