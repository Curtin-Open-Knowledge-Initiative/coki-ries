/*
## Summary

ETL for Field of Research codes (ANZSIC 2020)

## Description

Codes sourced from: https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-research-classification-anzsrc/latest-release
Transformed and uploaded into BigQuery

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0

-- ## Requires
exec telescope.js

-- ## Creates
table raw_forcodes_2020
*/
const app = require('app');
const DATADIR = app.reserve('data/fors_2020');
const STATE = {
  ...app.conf(), // replace, keyfile, project, dataset
  table  : 'raw_forcodes_2020',
  url    : 'http://aria.stats.govt.nz/aria/Aria/Download?filename=D06E4D1F26C55127D3203BC02046628214D1B15F\\19\\C6D957420B813E2DFA7EDE27D5D9596377223A92.csv&request=oaAA6ccL',
  dfile  : app.resolve(DATADIR,'2020.csv'),
  ufile  : app.resolve(DATADIR,'2020.jsonl'),
  schema : {  
    description : 'Official Field of Research (FoR) codes sourced from Official Research Organisation Registry data sourced from http://aria.stats.govt.nz/ and https://www.abs.gov.au/',
    fields : [
      { name:'code', type:'STRING', description:'Field of research code (either 2-digit, 4-digit or 6-digit)' },
      { name:'name', type:'STRING', description:'Field of research' }
    ]
  },
}

// download source data
async function download() {
  if (STATE.replace || !app.exists(STATE.dfile)) { 
    app.log('Downloading...');
    app.curl(STATE.url, STATE.dfile);
  }
}

// transforms 2020 FoR codes from a CSV dump (the HTML method can't be used because special characters aren't properly encoded by the Aria site)
async function transform() {
  if (!STATE.replace && app.exists(STATE.ufile)) return;
  app.log('Transforming...');
  const codes = {};
  const lines = app.file.load(STATE.dfile).split('Code,Descriptor,')[1].trim().split("\n");
  for (let line of lines) {
    let [code, ...name] = line.split(',');
    code = code.trim();
    name = name.filter(s => s).join(',').split('"').join('');
    codes[code] = name;
  }
  const records = [];
  for (let key of Object.keys(codes).sort()) {
    records.push({
      code : key,
      name : codes[key],
    });
  }
  app.save(records, STATE.ufile);
  app.save(records, 'docs/for_codes_2020.jsonlr');
}

// upload the jsonl file to a BigQuery table (always overrides)
async function upload() {
  if (!STATE.replace && await app.db.exists(app.db.connect(STATE))) { return; }
  app.log('Uploading...');
  await app.db.upload_jsonl(app.db.connect(STATE), STATE.ufile, STATE.schema);
}

async function run_telescope(conf_user={}) {
  app.log(`Starting telescope: ${__filename}`);
  if (!DATADIR) return app.log('ERROR: unable to create data directory');
  Object.assign(STATE,conf_user);
  await download();
  await transform();
  await upload();
  app.log('Finished');
}

if (require.main === module) {
  run_telescope({ replace : process.argv[2] == '--replace' });
}
module.exports = run_telescope;
