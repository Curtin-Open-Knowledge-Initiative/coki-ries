/*
## Summary
ETL RoR codes from ror.org into BigQuery

## Description
Downloads the most recent data dump from the Research Organization Registry 
Community: https://ror.readme.io/docs/data-dump

Transforms and uploads into a table in BigQuery

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0

## Requires
exec telescope.js
file ror.org

## Creates
table raw_rors
*/
const app = require('app');
const DATADIR = app.reserve('data/rors');
const STATE = {
  ...app.conf(), // replace, keyfile, project, dataset
  table   : 'raw_rors',
  meta : {
    link : 'https://zenodo.org/api/records/?communities=ror-data',
    file : app.resolve(DATADIR,'meta.json'),
  },
  data : {
    // these are set dynamically by the download function
    link  : '',
    file  : '',
    table : '',
  },
  schema : {  
    description : 'Official Research Organisation Registry data sourced from https://ror.readme.io/docs/data-dump',
    fields : [
      { name:'ror'    , type:'STRING', description:'Research Organisation Registry unique identifier' },
      { name:'since'  , type:'STRING', description:'The year that the institution was established' },
      { name:'status' , type:'STRING', description:'Current status of the institution (filter for active)' },
      { name:'type_0' , type:'STRING', description:'Primary activity type (ie, types[0])' },
      { name:'country', type:'STRING', description:'Country in which the research institution is located' },
      { name:'name'   , type:'STRING', description:'Name of the research institution' },
      { name:'link_0' , type:'STRING', description:'Primary URL (ie, links[0])' },
      { name:'types'  , type:'STRING', mode:'REPEATED', description:'All activity types that the institution is engaged in' },
      { name:'links'  , type:'STRING', mode:'REPEATED', description:'All links associated with the institution' },
    ]
  }
}

// download data from zenodo
async function download() {
  app.log('Downloading...');
  app.curl(STATE.meta.link, STATE.meta.file);
  const meta = app.load(STATE.meta.file);

  // set paths
  STATE.data.link  = meta?.hits?.hits[0]?.files?.pop().links?.self ?? '';
  STATE.data.file  = app.resolve(DATADIR, STATE.data.link.match('([^/]*).zip$')[1]) + '.json';
  STATE.data.table = STATE.data.file + '.jsonl';
  
  if (STATE.replace || !app.exists(`${STATE.data.file}.zip`)) {
    app.curl(STATE.data.link, STATE.data.file+'.zip');
  }
}

// transform raw JSON data from zenodo into a reduced jsonl file for upload
async function transform() {
  if (STATE.replace || app.exists(STATE.data.file) === false) {
    app.log('Unzipping...');
    app.exec(`unzip ${STATE.data.file}.zip -d ${DATADIR}`);
  }
  if (STATE.replace || app.exists(STATE.data.table) === false) {
    app.log('Transforming...');
    app.save(app.load(STATE.data.file).map(v => ({
      ror     : v.id,
      since   : v.established,
      status  : v.status,
      type_0  : v.types[0],
      country : v.country.country_name,
      name    : v.name,
      link_0  : v.links[0],
      types   : v.types,
      links   : v.links,
    })), STATE.data.table);
  }
}

// upload the jsonl file to a BigQuery table (always overrides)
async function upload() {
  if (!STATE.replace && await app.db.exists(app.db.connect(STATE))) { return; }
  app.log('Uploading...');
  await app.db.upload_jsonl(app.db.connect(STATE), STATE.data.table, STATE.schema);
}

// remove all intermediate files except the zipped source data file
async function cleanup() {
  app.log(`Cleaning up...`);
  app.exec(`rm ${[
    //STATE.meta.file,
    //STATE.data.file,
    //STATE.data.table,
    app.resolve(DATADIR,'__MACOSX')
  ].join(' ')}`);
}

async function run_telescope(conf_user={}) {
  app.log(`Starting telescope: ${__filename}`);
  if (!DATADIR) return app.log('ERROR: unable to create data directory');
  Object.assign(STATE,conf_user);
  await download();
  await transform();
  await upload();
  await cleanup();
  app.log('Finished');
}

if (require.main === module) {
  run_telescope(app.conf());
}
module.exports = run_telescope;
