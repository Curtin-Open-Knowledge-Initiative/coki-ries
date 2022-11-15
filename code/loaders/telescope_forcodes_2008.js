/*
## Summary

ETL for Field of Research codes (ANZSIC 2008)

## Description

2020 codes: https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-research-classification-anzsrc/latest-release
2008 codes: https://www.abs.gov.au/Ausstats/abs@.nsf/Latestproducts/4AE1B46AE2048A28CA25741800044242?opendocument

Transforms and uploads into a table in BigQuery

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0

-- ## Requires
exec telescope.js

-- ## Creates
table raw_forcodes_2008
*/
const app = require('app');
const DATADIR = app.reserve('data/fors_2008');
const STATE = {
  ...app.conf(), // replace, keyfile, project, dataset
  table  : 'raw_forcodes_2008',
  url    : `https://www.abs.gov.au/ausstats/abs@.nsf/Previousproducts/17DC1A688895C0C1CA257418000538FC?opendocument`,
  dfile  : app.resolve(DATADIR,'2008.html'),
  ufile  : app.resolve(DATADIR,'2008.jsonl'),
  schema : {  
    description : 'Official Field of Research (FoR) codes sourced from Official Research Organisation Registry data sourced from http://aria.stats.govt.nz/ and https://www.abs.gov.au/',
    fields : [
      { name:'code', type:'STRING' , description:'Field of research code (either 2-digit, 4-digit or 6-digit)' },
      { name:'name', type:'STRING' , description:'Field of research' }
    ]
  },
}

// download source data
async function download() {
  if (STATE.replace || ! app.exists(STATE.dfile)) {
    app.log('Downloading...');
    app.curl(STATE.url, STATE.dfile);
  }
}

// upload the jsonl file to a BigQuery table (always overrides)
async function upload() {
  if (STATE.replace || ! await app.db.exists(app.db.connect(STATE))) {
    app.log('Uploading...');
    await app.db.upload_jsonl(app.db.connect(STATE), STATE.ufile, STATE.schema);
  }
}

// extracts 2008 FoR codes from an HTML dump
async function transform() {
  if (!STATE.replace && app.exists(STATE.ufile)) return;
  app.log('Transforming...');

  // get innerText from HTML
  function innertext(html) {
    const keep = [];
    let inside = false;
    
    for (let c of html) {
      if (c == '<' && !inside) inside = true;
      else if (c == '>' && inside) inside = false;
      else keep.push(inside ? ' ' : c);
    }
    return keep.join('').split(/\s/).filter(s => s).join(' ');
  }  
  const text = innertext(app.file.load(STATE.dfile)).split('APPENDIX 1 FOR FIELDS BY CODE NUMBER')[1].split('Previous')[0].split('continued').join('');
  const codes = {};    
  for (let m of text.matchAll(/[0-9]+[^0-9]+/g)) {
    let [code,...name] = m[0].split(' ');
    codes[code] = name.join(' ').trim();
  }
  const records = [];
  for (let key of Object.keys(codes).sort()) {
    records.push({
      code : key,
      name : codes[key],
    });
  }
  app.save(records, STATE.ufile);
  app.save(records, 'data/for_codes_2008.jsonlr');
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
