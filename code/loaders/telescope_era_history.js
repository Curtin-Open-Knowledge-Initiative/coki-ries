/*
## Summary
ETL for the ERA 2018 journal list (and FoRs that come with the list)

## Description

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0

## Requires
exec telescope.js

## Creates
table era_historical_ratings
*/
const app = require('app');
const DATADIR = app.reserve('data/era_historical_ratings');
const STATE = {
  ...app.conf(), // replace, keyfile, project, dataset
  table  : 'era_historical_ratings',
  url    : 'https://dataportal.arc.gov.au/ERA/API/ratings?page%5Bsize%5D=179&page%5Bnumber%5D=1&filter=',
  dfile  : app.resolve(DATADIR,'raw_ratings_'),
  ufile  : app.resolve(DATADIR,'raw_ratings_upload.jsonl'),
  schema : {  
    description : 'Official ERA outcomes table from: https://dataportal.arc.gov.au/ERA/Web/Outcomes#/institution/',
    fields : [
      { name:'hep_code', type:'STRING', mode:'REQUIRED', description:'short-code for the Australian institution (higher education provider)' },
      { name:'hep_name', type:'STRING', mode:'REQUIRED', description:'institution name' },
      { name:'for_vers', type:'STRING', mode:'REQUIRED', description:'version of the field of research codes being used' },
      { name:'for_code', type:'STRING', mode:'REQUIRED', description:'field of research code' },
      { name:'for_name', type:'STRING', mode:'REQUIRED', description:'field of research name' },
      { name:'era_2010', type:'STRING', mode:'REQUIRED', description:'ERA rating assigned in 2010 (NA = not assessed)' },
      { name:'era_2012', type:'STRING', mode:'REQUIRED', description:'ERA rating assigned in 2012 (NA = not assessed)' },
      { name:'era_2015', type:'STRING', mode:'REQUIRED', description:'ERA rating assigned in 2015 (NA = not assessed)' },
      { name:'era_2018', type:'STRING', mode:'REQUIRED', description:'ERA rating assigned in 2018 (NA = not assessed)' },
    ]
  },
}
const hep_codes = [
  'ACU','ADE','ANU','BAT','BON','CAN','CDU','CQU','CSU','CUT','DIV','DKN','ECU','FED',
  'FLN','GRF','JCU','LTU','MEL','MON','MQU','MUR','NDA','NEW','NSW','QLD','QUT','RMT',
  'SCU','SWN','SYD','TAS','TOR','UNE','USA','USC','USQ','UTS','UWA','VIC','WOL','WSU',
];

// download source data
async function download() {
  for (let code of hep_codes) {
    if (STATE.replace || !app.exists(STATE.dfile + code + '.json')) {
      app.log('Downloading',code);
      app.curl(STATE.url+code, STATE.dfile + code + '.json');
    }
  }
}

// transform raw JSON data from zenodo into a reduced jsonl file for upload
async function transform() {
  if (!STATE.replace && app.exists(STATE.ufile)) { return; }
  app.log('Transforming...');
  let table = [];
  for (let code of hep_codes) {
    app.load(STATE.dfile + code + '.json').data.forEach(rec => {
      table.push({
        hep_code : rec.attributes.institution['short-name'],
        hep_name : rec.attributes.institution.name,
        for_vers : '2008',
        for_code : rec.attributes['field-of-research'].code,
        for_name : rec.attributes['field-of-research'].name,
        era_2010 : rec.attributes.outcomes[0].value ?? 'NA',
        era_2012 : rec.attributes.outcomes[1].value ?? 'NA',
        era_2015 : rec.attributes.outcomes[2].value ?? 'NA',
        era_2018 : rec.attributes.outcomes[3].value ?? 'NA',
      });
    });
  }
  app.save(table,STATE.ufile);
}

// upload the jsonl file to a BigQuery table (always overrides)
async function upload() {
  if (!STATE.replace && await app.db.exists(app.db.connect(STATE))) { return; }
  app.log('Uploading...');
  let link = app.db.connect(STATE);
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
