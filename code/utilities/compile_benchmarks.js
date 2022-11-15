/*
## Summary
Run SQL queries to (re)build analytical benchmark tables.

## Description
This script will build the series of benchmark_* tables in the database that you link to. The
script first requires the core_* series of tables to have been built by copmile_core.js. Benchmarks 
can be set to build for filtered sets of institutions, topics of research and years. By default, it 
will build for ERA 2023: Australia HEPS, 2020 ANZSRC codes and 2016-2021.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const app = require('app');

function compile_benchmarks(conf={}) {
  const research_outputs   = require('../queries/benchmark_outputs'    ).compile;
  const benchmark_cpp      = require('../queries/benchmark_cpp'        ).compile;
  const benchmark_hpi      = require('../queries/benchmark_hpi'        ).compile;
  const benchmark_rci      = require('../queries/benchmark_rci'        ).compile;
  const rci_papers         = require('../queries/benchmark_rci_papers' ).compile;
  const rci_groups         = require('../queries/benchmark_rci_groups' ).compile;
  const rci_classes        = require('../queries/benchmark_rci_classes').compile;
  const benchmark_centiles = require('../queries/benchmark_centiles'   ).compile;
  const benchmark_summary  = require('../queries/benchmark_summary'    ).compile;

  // query strings that will eventually be combined into a single output
  const queries = [`
    -------------------------------------------------------------------------------
    -- WARNING: these queries are machine-generated. Any changes that you make   --
    -- here will be overwritten on the next compilation. If a permanent query    --
    -- alteration is required then modify the files in /code/queries/            --
    -------------------------------------------------------------------------------
    -- generated by: ${__filename}
    CREATE SCHEMA IF NOT EXISTS \`${conf.ns_core}\`;
  `];

  // research output tables 
  ['world','local'].forEach(scope => 
    [4,2].forEach(digits => {
      queries.push(research_outputs(Object.assign({}, conf, { scope, digits, institution: true, field: true, year: true })));
      queries.push(research_outputs(Object.assign({}, conf, { scope, digits, institution: true, field: true, year:false })));
      queries.push(research_outputs(Object.assign({}, conf, { scope, digits, institution: true, field:false, year: true })));
      queries.push(research_outputs(Object.assign({}, conf, { scope, digits, institution:false, field: true, year: true })));
      queries.push(research_outputs(Object.assign({}, conf, { scope, digits, institution: true, field:false, year:false })));
      queries.push(research_outputs(Object.assign({}, conf, { scope, digits, institution:false, field: true, year:false })));
      queries.push(research_outputs(Object.assign({}, conf, { scope, digits, institution:false, field:false, year: true })));
    })
  );

  // CPP benchmarks and centiles
  ['world','local'].forEach(scope => [4,2].forEach(digits => queries.push(benchmark_cpp     (Object.assign({}, conf, {scope,digits})))));
  ['world','local'].forEach(scope => [4,2].forEach(digits => queries.push(benchmark_centiles(Object.assign({}, conf, {scope,digits})))));
  
  // HPI benchmarks
  [4,2].forEach(digits => queries.push(benchmark_hpi(Object.assign({}, conf, {digits}))));

  // assigns RCI values to each paper (depends on CPP benchmarks)
  queries.push(rci_papers(conf));

  // now that individual papers have RCI values, calculate RCI benchmarks
  [4,2].forEach(digits => queries.push(benchmark_rci(Object.assign({}, conf, {digits}))));

  // assign RCI scores to each (ror,for,year)
  ['world','local'].forEach(scope => 
    [4,2].forEach(digits => {
      queries.push(rci_groups(Object.assign({}, conf, { scope, digits, institution: true, field: true, year: true })));
      queries.push(rci_groups(Object.assign({}, conf, { scope, digits, institution: true, field: true, year:false })));
      queries.push(rci_groups(Object.assign({}, conf, { scope, digits, institution: true, field:false, year: true })));
      queries.push(rci_groups(Object.assign({}, conf, { scope, digits, institution:false, field: true, year: true })));
      queries.push(rci_groups(Object.assign({}, conf, { scope, digits, institution: true, field:false, year:false })));
      queries.push(rci_groups(Object.assign({}, conf, { scope, digits, institution:false, field: true, year:false })));
      queries.push(rci_groups(Object.assign({}, conf, { scope, digits, institution:false, field:false, year: true })));
    })
  );

  // assign RCI classes to papers and fields, then build a summary (TODO: refactor into more groupings (as above))
  queries.push(rci_classes(conf));

  // summary table of all benchmarks
  [4,2].forEach(digits => queries.push(benchmark_summary (Object.assign({}, conf, {digits}))));

  return queries;
}
module.exports = compile_benchmarks;

if (require.main === module) {
  async function run_queries(conf) {
    const queries = compile_benchmarks(conf);
    for (let sql of queries) {
      if (conf.verbose) console.log(sql);
      if (conf.dryrun) continue;
      await app.query(app.link_dest,sql);
    }
  }  
  run_queries(app.conf());
}