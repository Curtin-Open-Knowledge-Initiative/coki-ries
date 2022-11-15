/*
## Summary
Minimal ETL for ISSN data

## Description
Downloads the authoritative ISSN <-> ISSN-L mapping from issn.org then uploads it into BigQuery.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0

## Requires
exec telescope.js
file issn.org

## Creates
table raw_issns
*/
const app = require('app');
const DATADIR = app.reserve('data/issns');
const STATE = {
  ...app.conf(), // replace, keyfile, project, dataset
  table   : 'raw_issns',
  url     : 'https://www.issn.org/wp-content/uploads/2014/03/issnltables.zip',
  dfile   : app.resolve(DATADIR,'download.txt'),
  ufile   : app.resolve(DATADIR,'upload.jsonl'),
  schema  : {  
    description : 'Official ISSN -> ISSN-L mapping from https://www.issn.org/wp-content/uploads/2014/03/issnltables.zip',
    fields : [
      { name:'issn' , type:'STRING', mode:'REQUIRED', description:'ISSN' },
      { name:'issnl', type:'STRING', mode:'REQUIRED', description:'Linking ISSN' }
    ]
  },
}

// download source data
async function download() {
  if (!STATE.replace && app.exists(STATE.dfile)) { return; }
  app.log('Downloading...'); 
  app.exec(`rm ${DATADIR}/*.txt ${DATADIR}/*.jsonl ${DATADIR}/*.zip`);
  app.curl(STATE.url, `${DATADIR}/tables.zip`);
  app.exec(`unzip -d ${DATADIR} ${DATADIR}/tables.zip`);
  app.exec(`mv ${DATADIR}/*.ISSN-to-ISSN-L.txt ${STATE.dfile}`);
}

// transform to JSONL file for upload to bigquery
async function transform() {
  if (!STATE.replace && app.exists(STATE.ufile)) { return; }
  app.log('Transforming...');
  const rx = /^[0-9]{4}-[0-9]{3}[0-9X]$/;
  const ok = v => {
    v = v.trim().toUpperCase();
    return rx.test(v) ? v : '';
  }
  app.save(app.file.load_lines(STATE.dfile).slice(1).map(v => {
    let [issn, issnl] = v.split("\t");
    issn  = ok(issn);
    issnl = ok(issnl);
    return issn && issnl ? { issn, issnl } : null
  }).filter(v => v), STATE.ufile);
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
