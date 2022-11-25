/*
## Summary
Extracts raw data from the COKI database (full set). This is not currently meant to be publicly available.

## Description
Downloads a set of metadata for scientific publications, indexed by DOI, from the COKI dataset. To 
run this ETL script, you will need access credentials to your own BigQuery instance and to the COKI 
BigQuery instance.

## Contacts
coki@curtin.edu.au (for enquiries regarding data access)
julian.tonti-filippini@curtin.edu.au (code author)

## License
Apache 2.0

## Requires
file other.cloud

## Creates
table raw_papers
*/
const app = require('app');
const DATADIR = app.reserve('data/coki');
const STATE = {
  ...app.conf(), // replace, keyfile, project, dataset
  table : 'raw_papers',
  urls  : [
    'https://storage.googleapis.com/rt-era-public/data/papers/2016/000000000000.jsonl.gz',
    'https://storage.googleapis.com/rt-era-public/data/papers/2016/000000000001.jsonl.gz',
    'https://storage.googleapis.com/rt-era-public/data/papers/2016/000000000002.jsonl.gz',
  ],
  schema : {
    description : 'Extract of publication metadata from the COKI database',
    fields : [
      { name:'doi'  , type:'STRING' , mode:'REQUIRED', description:'Digital Object Identifier for the publication' },
      // { name:'title', type:'STRING', description:'Title of the publication' },
      // { name:'authors', type:'STRING', mode:'REPEATED', description:'List of author surnames' },
      { name:'year' , type:'INTEGER', mode:'REQUIRED', description:'Year of publication' },
      { name:'cits' , type:'INTEGER', mode:'REQUIRED', description:'Number of accumulated citations to date' },
      { name:'is_oa', type:'BOOLEAN', mode:'REQUIRED', description:'True if the publication is recorded as Open Access' },
      { name:'type' , type:'STRING' , mode:'REQUIRED', description:'The type of the publication, currently only contains journal-articles' },
      { name:'issns', type:'STRING' , mode:'REPEATED', description:'List of ISSNs for the journal associated with this publication' },
      { name:'rors' , type:'STRING' , mode:'REPEATED', description:'List of ROR codes for institutions affiliated with this publication' }
    ]
  },
}

// download source data
async function download() {
  for (let url of STATE.urls) {
    const name = url.split('/').pop();
    const dfile = app.resolve(DATADIR,name);
    if (STATE.replace || !app.exists(dfile)) {
      app.log('Downloading',url);
      app.curl(url, dfile);
    }
  }
}

// upload the jsonl file to a BigQuery table (always overrides)
async function upload() {
  if (STATE.replace || ! await app.db.exists(app.db.connect(STATE))) {
    app.log('Uploading...');
    const link = app.db.connect(STATE);
    await app.db.upload({ link, schema:STATE.schema, ifile:app.resolve(DATADIR, STATE.urls[0].split('/').pop()), replace:true });
    await app.db.upload({ link, schema:STATE.schema, ifile:app.resolve(DATADIR, STATE.urls[1].split('/').pop()), replace:false });
    await app.db.upload({ link, schema:STATE.schema, ifile:app.resolve(DATADIR, STATE.urls[2].split('/').pop()), replace:false });
  }
}

async function run_telescope(conf_user={}) {
  app.log(`Starting telescope: ${__filename}`);
  if (!DATADIR) return app.log('ERROR: unable to create data directory');
  Object.assign(STATE,conf_user);
  await download();
  await upload();
  app.log('Finished');
}

if (require.main === module) {
  run_telescope(app.conf());
}
module.exports = run_telescope;
