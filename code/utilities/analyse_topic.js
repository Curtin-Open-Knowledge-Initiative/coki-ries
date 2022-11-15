/*
## Summary
Build or rebuild analysis tables for a specific topic of research.

## Description
Builds a set of tables that focus on analysis for a single topic of research, defined by a topic ID.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const app = require('app');

async function compile_report_topic(conf={}) {
  console.log('NOT IMPLEMENTED YET');
  return [];

  const report_topic = require('../queries/report_topic').compile;
  const {name,code} = await get_user_input();
  const queries = [`
    -------------------------------------------------------------------------------
    -- WARNING: these queries are machine-generated. Any changes that you make   --
    -- here will be overwritten on the next compilation. If a permanent query    --
    -- alteration is required then modify the files in /code/queries/            --
    -------------------------------------------------------------------------------
    -- generated by: ${__filename}
    CREATE SCHEMA IF NOT EXISTS \`${conf.ns_core}\`;
  `];
  queries.push(report_topic(conf));
  return queries;
}

// gather user input
async function get_user_input() {
  const default_name = 'anzsrc_2020_4';
  const default_code = '3001'; // agricultural biotechnology
  const rl = require('readline').createInterface({
    input  : process.stdin,
    output : process.stdout
  });
  let name = await new Promise(pass => rl.question(`Enter the name of the topic-set to use (default: ${default_name}) -> `, pass));
  let code = await new Promise(pass => rl.question(`Enter the topic-code to analyse (default: ${default_code}) -> `, pass));
  rl.close();

  name = name.split(' ')[0].toLowerCase().trim();
  code = code.split(' ')[0].toLowerCase().trim();

  if (!name) name = default_name;
  if (!code) code = default_code;

  return {name,code};
}
module.exports = compile_report_topic;

if (require.main === module) {
  console.log('NOT IMPLEMENTED YET');
  process.exit();
  async function run_queries(conf) {
    const queries = compile_report_topic(conf);
    for (let sql of queries) {
      if (conf.verbose) console.log(sql);
      if (conf.dryrun) continue;
      await app.query(app.link_dest,sql);
    }
  }  
  run_queries(app.conf());
}
