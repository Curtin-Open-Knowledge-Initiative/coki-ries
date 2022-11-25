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

## Requires
file other.cloud

## Creates
table raw_forcodes
*/
const app = require('app');
const DATADIR = app.reserve('data/fors');
const STATE = {
  ...app.conf(), // replace, keyfile, project, dataset
  table  : 'raw_forcodes',
  v2008  : {
    url    : `https://www.abs.gov.au/ausstats/abs@.nsf/Previousproducts/17DC1A688895C0C1CA257418000538FC?opendocument`,
    dfile  : app.resolve(DATADIR,'2008.html'),
    ufile  : app.resolve(DATADIR,'2008.jsonl'),
  },
  v2020  : {
    url    : 'http://aria.stats.govt.nz/aria/Aria/Download?filename=D06E4D1F26C55127D3203BC02046628214D1B15F\\19\\C6D957420B813E2DFA7EDE27D5D9596377223A92.csv&request=oaAA6ccL',
    dfile  : app.resolve(DATADIR,'2020.csv'),
    ufile  : app.resolve(DATADIR,'2020.jsonl'),
  },
  ufile  : app.resolve(DATADIR, 'upload.jsonl'),
  schema : {  
    description : 'Official Field of Research (FoR) codes sourced from Official Research Organisation Registry data sourced from http://aria.stats.govt.nz/ and https://www.abs.gov.au/',
    fields : [
      { name:'vers', type:'STRING', description:'Field of research ANZSIC version (either 2008 or 2020)' },
      { name:'code', type:'STRING', description:'Field of research code (either 2-digit, 4-digit or 6-digit)' },
      { name:'name', type:'STRING', description:'Field of research name' }
    ]
  },
}

// download source data
async function download() {
  if (STATE.replace || !app.exists(STATE.v2008.dfile)) {
    app.log('Downloading 2008...');
    app.curl(STATE.v2008.url, STATE.v2008.dfile);
  }
  if (STATE.replace || !app.exists(STATE.v2020.dfile)) { 
    app.log('Downloading 2020...');
    app.curl(STATE.v2020.url, STATE.v2020.dfile);
  }
}

// upload the jsonl file to a BigQuery table (always overrides)
async function upload() {
  if (STATE.replace || ! await app.db.exists(app.db.connect(STATE))) {
    app.log('Uploading...');
    await app.db.upload_jsonl(app.db.connect(STATE), STATE.ufile, STATE.schema);
  }
}

// transform the two forcode files
async function transform() {
  if (STATE.replace || !app.exists(STATE.v2008.ufile)) {
    app.log('Transforming 2008...');
    await transform_2008(STATE.v2008.dfile, STATE.v2008.ufile);
  }
  if (STATE.replace || !app.exists(STATE.v2020.ufile)) {
    app.log('Transforming 2020...');
    await transform_2020(STATE.v2020.dfile, STATE.v2020.ufile);
  }
  if (STATE.replace || !app.exists(STATE.ufile)) {
    app.file.save(STATE.ufile, app.file.load(STATE.v2008.ufile).trim() + "\n" + app.file.load(STATE.v2020.ufile).trim() + "\n");
  }

  // extracts 2008 FoR codes from an HTML dump
  async function transform_2008(dfile,ufile) {
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
    const text = innertext(app.file.load(dfile)).split('APPENDIX 1 FOR FIELDS BY CODE NUMBER')[1].split('Previous')[0].split('continued').join('');
    const codes = {};    
    for (let m of text.matchAll(/[0-9]+[^0-9]+/g)) {
      let [code,...name] = m[0].split(' ');
      codes[code] = name.join(' ').trim();
    }
    const records = [];
    for (let key of Object.keys(codes).sort()) {
      records.push({
        vers : '2008',
        code : key,
        name : codes[key],
      });
    }
    app.save(records, ufile);
    app.save(records, 'data/for_codes_2008.jsonlr');
  }

  // transforms 2020 FoR codes from a CSV dump (the HTML method can't be used because special characters aren't properly encoded by the Aria site)
  async function transform_2020(dfile,ufile) {
    const codes = {};
    const lines = app.file.load(dfile).split('Code,Descriptor,')[1].trim().split("\n");
    for (let line of lines) {
      let [code, ...name] = line.split(',');
      code = code.trim();
      name = name.filter(s => s).join(',').split('"').join('');
      codes[code] = name;
    }
    const records = [];
    for (let key of Object.keys(codes).sort()) {
      records.push({
        vers : '2020',
        code : key,
        name : codes[key],
      });
    }
    app.save(records, ufile);
    app.save(records, 'docs/for_codes_2020.jsonlr');
  }  
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
  run_telescope(app.conf());
}
module.exports = run_telescope;
