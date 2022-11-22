/*

Simple helper functions for interacting with BigQuery. Set default values in ../config/config.js
see: https://cloud.google.com/bigquery/docs/reference/rest/v2/tables#TableSchema
see: https://cloud.google.com/bigquery/docs/reference/rest/v2/Job#jobconfigurationload

Example -> upload({
  keyfile_path : app.conf.keyfile_path,
  project_name : 'coki-curtin-research-qualities',
  dataset_name : 'COKI_DOIs_Schools', 
  table_name   : 'era_code_to_issnl',
  input_file   : ifile,
  options      : {
    createDisposition : 'CREATE_IF_NEEDED',
    writeDisposition  : 'WRITE_TRUNCATE',
    sourceFormat      : 'NEWLINE_DELIMITED_JSON',
    autodetect        : false,
    destinationTableProperties : {
      description : 'Mapping from field of research code (FoR) to linking ISSN (ISSN-L)',
    },
    schema : {
      fields : [
        { name:'year' , type:'INTEGER', mode:'REQUIRED', description:'Year that the field of research code was defined' },
        { name:'code' , type:'INTEGER', mode:'REQUIRED', description:'Field of research code' },
        { name:'name' , type:'STRING' , mode:'REQUIRED', description:'Field of research name' },
        { name:'issn' , type:'STRING' , mode:'REQUIRED', description:'ISSN of work to which the research code has been assigned' },
        { name:'issnl', type:'STRING' , mode:'NULLABLE', description:'Linking ISSN associated with the ISSN (from issn.org)' },
      ]
    }
  },
});

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const fs = require('fs');
const sh = require('shelljs');
const {BigQuery} = require('@google-cloud/bigquery');
const { mode_fail, is, must } = require('./lib_is'); mode_fail();

// returns a link object
function Link({keyfile='credentials.json',project='',dataset='',table=''}) {
  if (this.constructor != Link) return new Link({keyfile,project,dataset,table});
  is(String,keyfile); this.keyfile = keyfile;
  is(String,project); this.project = project;
  is(String,dataset); this.dataset = dataset;
  is(String,table);   this.table   = table;
  must(fs.existsSync(keyfile), `ERROR: BigQuery keyfile not found: ${keyfile}`);

  this.bq = new BigQuery({
    keyFilename : keyfile,
    projectId   : project,
  });
}

// get a connection link to a BigQuery database
function connect({keyfile='credentials.json',project='',dataset='',table=''}) {
  return new Link({keyfile,project,dataset,table});
}

// check whether or not a specified resource exists dataset[table]
async function exists(link) {
  if (link.dataset && ! await dataset_exists(link)) return false;
  if (link.table   && ! await   table_exists(link)) return false;
  return true;
}

// check, create or delete a dataset in the given project
async function dataset_exists(link) {
  is(Link,link);
  return (await link.bq.dataset(link.dataset).exists())[0];
}
async function dataset_create(link) {
  if (await dataset_exists(link)) return true;
  await link.bq.createDataset(link.dataset);
  return await dataset_exists(link);
}
async function dataset_delete(link) {
  if (await dataset_exists(link)) {
    await link.bq.dataset(link.dataset).delete({force:true});
  }
  return await dataset_exists(link) === false;
}

// check, create or delete a table in the given dataset
async function table_exists(link) {
  is(Link,link);
  return (await link.bq.dataset(link.dataset).table(link.table).exists())[0];
}
async function table_create(link) {
  if (await table_exists(link)) return true;
  await link.bq.dataset(link.dataset).createTable(link.table, {schema:link.schema});
  return await table_exists(link);
}
async function table_delete(link) {
  // cli: bq rm --profile_file='creds.json' --project_id='project' --force --table 'dataset.table' | jq > schema.json
  if (await table_exists(link)) {
    await link.bq.dataset(link.dataset).table(link.table).delete();
  }
  return await table_exists(link) === false;
}
async function table_schema(link) {
  // cli: bq show --profile_file='creds.json' --project_id='project' --schema 'dataset.table' | jq > schema.json
  if (await table_exists(link)) {
    return (await link.bq.dataset(link.dataset).table(link.table).getMetadata())[0].schema;
  }
}

// list datasets, tables, or both
async function list_datasets(link) {
  is(Link,link);
  return (await link.bq.getDatasets())[0].map(v => v.id);
}
async function list_tables(link, dataset='') {
  is(Link,link);
  is(String,dataset);
  return (await link.bq.dataset(dataset||link.dataset).getTables())[0].map(v => v.id);
}
async function list(link) {
  is(Link,link);
  let res = {};
  let ds = await list_datasets(link);
  for (let d of ds) { res[d] = await list_tables(link,d); }
  return res;
}

// run a query against the current project and return the rows of the result
async function query(link,sql) {
  is(Link,link);
  is(String,sql);
  try {
    const [job]  = await link.bq.createQueryJob({query:sql});
    const [rows] = await job.getQueryResults();
    return [null,rows];
  }
  catch (e) {
    //console.log(e.code, e.errors);
    return [e,null];
  }
}

// load a query from file and run it
async function query_load(link,ifile) {
  const sql = await fs.readFile(ifile);
  return await query(link,sql);
}

// run a query and download the results to a file or stdout (default)
function query_stream(link, sql='', handler=()=>{}) {
  return new Promise((pass,fail) => {
    if (!is(Link,link)) return fail('no Link object provided to query_stream');
    if (!is(String,sql)) return fail('query must be a string');
    if (!is(Function,handler)) return fail('handler must be a function');
    (link.bq.createQueryStream(sql)
      .on('data',  handler)
      .on('end',   (job) => pass())
      .on('error', (err) => fail(err))
    );
  });
}

// stream query results to an output file
function query_download(link,ofile,sql) {
  const ostream = fs.createWriteStream(ofile);
  return query_stream(link, sql, (v) => ostream.write(JSON.stringify(v) + "\n"));
}

// finalise the text of a query (strip comments, set creation method to either replace or skip)
function query_finalise(sql='',replace=false) {
  return sql.constructor === Array ? sql.map(s => query_finalise(s,replace)) : 
  (sql
    .replaceAll(/\/\*[^*]*\*\//g, '') // replace block comments
    .replaceAll(/--[^\n]*\n/g, '\n')  // replace inline comments
    .split("\n").filter(line => line.trim() != '').join("\n") // remove blank lines
    .replaceAll( // create or replace       OR   create only if missing 
      replace ? /CREATE TABLE IF NOT EXISTS/ig : 'CREATE OR REPLACE TABLE',
      replace ? /CREATE OR REPLACE TABLE/ig : 'CREATE TABLE IF NOT EXISTS',
    )
  );
}

// upload a CSV file to a BigQuery table with default options (returns promise)
function upload_csv(link, ifile, schema) {
  // see: https://cloud.google.com/bigquery/docs/reference/rest/v2/Job#jobconfigurationload
  return upload({ link, ifile, options : {
    createDisposition : 'CREATE_IF_NEEDED',
    writeDisposition  : 'WRITE_TRUNCATE',
    sourceFormat      : 'CSV',
    autodetect        : schema === undefined,
    schema            : schema ?? undefined
  }});
}

// upload a JSONL file to a BigQuery table with default options (returns promise)
function upload_jsonl(link, ifile, schema) {
  // see: https://cloud.google.com/bigquery/docs/reference/rest/v2/Job#jobconfigurationload
  return upload({ link, ifile, options : {
    createDisposition : 'CREATE_IF_NEEDED',
    writeDisposition  : 'WRITE_TRUNCATE',
    sourceFormat      : 'NEWLINE_DELIMITED_JSON',
    autodetect        : schema === undefined,
    schema            : schema ?? undefined
  }});
}

// upload a file to a table with custom options. Options: https://cloud.google.com/bigquery/docs/reference/rest/v2/Job#jobconfigurationload
function upload({ link, dataset='', table='', ifile='ifile.txt', replace=false, schema=null, options={} }) {

  return new Promise((pass,fail) => {
    const default_options = {
      createDisposition : 'CREATE_IF_NEEDED',
      writeDisposition  : replace ? 'WRITE_TRUNCATE' : 'WRITE_APPEND',
      sourceFormat      : ifile.includes('.jsonl') ? 'NEWLINE_DELIMITED_JSON' : 'CSV',
      compression       : ifile.includes('.gz') ? 'GZIP' : 'NONE',
      autodetect        : (schema || options.schema) ? false : true,
      schema            : schema || options.schema || null,
    };
    const opts = Object.assign(default_options,options);
    
    dataset = dataset || link.dataset;
    table   = table   || link.table;

    is(Link,link);
    is(String,dataset);
    is(String,table);
    is.File(ifile);
    is(Object,opts);

    const istream = fs.createReadStream(ifile);
    const ostream = link.bq.dataset(dataset).table(table).createWriteStream(opts);
    (istream.pipe(ostream)
      .on('job',      (job) => { console.log(job.metadata); })
      .on('complete', (job) => { console.log('upload complete'); pass(); })
      .on('error',    (err) => { fail(err); })
    );
  });
}

// download a whole table to a file
function download(link, ofile='./out.jsonl', format='jsonl') {
  switch (format) {
    case 'jsonl': download_jsonl(link,ofile); break;
    case 'csv'  : download_csv  (link,ofile); break;
    default: console.error(__filename, 'unknown format', format);
  }
}
function download_jsonl(link,ofile='./out.jsonl') {
  const ostream = fs.createWriteStream(ofile);
  return query_stream(link, `SELECT * FROM \`${link.dataset}.${link.table}\``, (v) => ostream.write(JSON.stringify(v) + "\n"));
}
function download_csv(link,ofile='./out.csv') {
  const ostream = fs.createWriteStream(ofile);
  let wrote_headers = false;
  return query_stream(link, `SELECT * FROM \`${link.dataset}.${link.table}\``, (v) => {
    let line = '';
    if (!wrote_headers) {
      line = JSON.stringify(Object.keys(v));
      ostream.write(line.substring(1,line.length-1) + "\n");
      wrote_headers = true;
    }
    line = JSON.stringify(Object.values(v));
    ostream.write(line.substring(1,line.length-1) + "\n");
  });
}
function safe_name(name='') {
  return name?.replaceAll(/[^A-Z0-9-_]/gi,'') ?? '';
}
// convert a bigquery schema object to an equivalent SQL query
function schema_to_sql(schema={}) {
  const sql = [];
  sql.push(`CREATE TABLE {{tablename}} (`);

  function desc(str) {
    return `OPTIONS(description='${(str ?? '').replaceAll("'", '"')}')`;
  }
  function add(field_list,indent='  ') {
    for (let {name,type,mode,description,fields} of field_list) {
      type = type?.toUpperCase() || 'STRING';
      mode = mode?.toUpperCase() || '';
      description = desc(description);

      if (mode == 'REPEATED') {
        if (type == 'RECORD') {
          sql.push(`${indent}${name} ARRAY<STRUCT<`);
          add(fields,indent+indent);
          sql.push(`${indent}>> ${description},`);
        }
        else {
          sql.push(`${indent}${name} ARRAY<${type}> ${description},`);
        }
      }
      else {
        if (type == 'RECORD') {
          sql.push(`${indent}${name} STRUCT<`);
          add(fields,indent+indent);
          sql.push(`${indent}> ${description},`);
        }
        else {
          sql.push(`${indent}${name} ${type}${mode == 'REQUIRED' ? ' NOT NULL' : ''} ${description},`);
        }
      }
    }
    // strip residual comma
    let s = sql.pop();
    sql.push(s.substring(0,s.length-1));
  }
  add(schema.fields);
  sql.push(`) ${desc(schema.description)};`);
  return sql.join("\n");
}

// create a table and import data from a schema file and data files in a GSC bucket
async function create_from_bucket({ link={}, name='a_table', bucket='rt-era-public', path_schema='schema.json', path_data='*.jsonl.gz', replace=false }) {
  name = safe_name(name);
  link.table = name;
  link.schema = {};

  // if replacing, or the table doesn't exist, then load the schema from the bucket
  if (replace || !await table_exists(link)) {
    try { 
      link.schema = JSON.parse(sh.exec(`curl https://storage.googleapis.com/${bucket}/${path_schema}`));
    }
    catch (e) {
      return console.error('ERROR: the schema could not be loaded');
    };
    if (!await table_create(link)) {
      return console.error('ERROR: the table could not be created');
    }
  }

  // build the query
  const table = `${link.project}.${link.dataset}.${link.name}`;
  const sql = `
    BEGIN
      TRUNCATE TABLE \`${table}\`;
      LOAD DATA INTO \`${table}\` 
      FROM FILES(
        format = 'JSON',
        uris   = ['gs://${bucket}/${path_data}']
      );
    END
  `;
  let [e] = await query(link,sql);
  return e ? console.error('ERROR: unable to load data') : console.log('loading succeeded');
}


module.exports = { 
  connect, exists, 
  list, list_datasets, list_tables, 
  dataset_exists, dataset_create, dataset_delete,
  table_exists, table_create, table_delete,
  query, query_stream, query_download, query_load, query_finalise,
  upload, upload_csv, upload_jsonl,
  download, download_jsonl, download_csv,
  safe_name, schema_to_sql,
  create_from_bucket,
};

// run tests (pull metadata, download query to file, upload to table, delete table and file
if (require.main === module) {
  async function test() {
    const keyfile = "../../conf/credentials_era.json";
    const link = connect({keyfile, project:'rt-era'});
    const ofile = './out.jsonl';
    link.dataset = 'era';
    link.table = 'temp';
    console.table(await list_datasets(link));
    console.table(await list_tables(link,'era'));
    console.log(await list(link));
    console.table(await query(link,`select * from rt-era.era.heps limit 100`));
    await query_stream(link, `select * from rt-era.era.journals`, v => console.log(JSON.stringify(v)));
    await query_download(link, ofile, `select * from rt-era.era.journals`, v => console.log(JSON.stringify(v)));
    await upload_jsonl(link, ofile, 'temp');
    console.log(await query(link, 'select count(1) AS numrows FROM rt-era.era.temp'));
    console.log(await query(link, 'drop table rt-era.era.temp'));
    try {
      console.log(await query(link, 'select count(1) AS numrows FROM rt-era.era.temp'));
    }
    catch (e) {
      console.log('table deleted');
    }
    fs.rmSync(ofile);
  }

  // get the lastest DOI table from the observatory academy project
  async function test2() {
    const keyfile = "../../conf/credentials_era.json";
    const link = connect({keyfile, project:'academic-observatory'});
    console.table(await list_datasets(link));
    console.table(await list_tables(link,'observatory'));
    console.log(await list(link));
  }

  // test if table exists
  async function test3() {
    const link1 = connect({
      keyfile : '../../conf/credentials_era.json',
      project : 'rt-era',
      dataset : 'era',
      table   : 'does_not_exist'
    });
    console.log('should be false:', await exists(link1));
    const link2 = connect({
      keyfile : '../../conf/credentials_era.json',
      project : 'rt-era',
      dataset : 'era',
      table   : 'papers'
    });
    console.log('should be true:', await exists(link2));
  }

  // test download functions
  async function test4() {
    const keyfile = "../../conf/credentials_era.json";
    const link = connect({keyfile, project:'rt-era'});
    link.dataset = 'era';
    link.table = 'heps';
    await download(link, './out.jsonl', 'jsonl');
    await download(link, './out.csv'  , 'csv'  );
  }

  // test downloading a big table
  async function test5() {
    const keyfile = "../../conf/credentials_era.json";
    const link = connect({keyfile, project:'rt-era'});
    link.dataset = 'era';
    link.table = 'core_papers';
    await download(link, './out.jsonl', 'jsonl');
  }

  // test getting the schema for a table
  async function test6() {
    const keyfile = "../../conf/credentials_era.json";
    const link = connect({keyfile, project:'rt-era'});
    link.dataset = 'mt_allison';
    link.table = 'mau_outputs';
    let schema = await table_schema(link);
    console.log(schema);
  }

  // test getting the schema for a complex table
  async function test7() {
    const keyfile = "../../conf/credentials_era.json";
    const link = connect({keyfile, project:'academic-observatory'});
    link.dataset = 'openalex';
    link.table = 'Work';
    let schema = await table_schema(link);
    console.log(JSON.stringify(schema.fields,null,2));
  }

  // delete a dataset
  async function test8() {
    const keyfile = "../../conf/credentials_era.json";
    const link = connect({keyfile, project:'rt-era'});
    link.dataset = 'era_2023_for4'; await dataset_delete(link);
    link.dataset = 'era_2023_for2'; await dataset_delete(link);
    link.dataset = 'era_2018_for4'; await dataset_delete(link);
    link.dataset = 'era_2018_for2'; await dataset_delete(link);
  }

  // test schema to SQL translation
  function test9() {
    console.log(schema_to_sql({ 
      description : 'a table',
      fields : [
        { name:'a', type:'STRING', description:'a nullable string' },
        { name:'b', type:'INTEGER', mode:'REQUIRED', description:'a required integer' },
        { name:'c', type:'STRING', mode:'REPEATED', description:'an array of strings' },
        { name:'d', type:'RECORD', description:'a nullable object', fields:[
          { name:'d1', type:'STRING', description:'a nullable string' },
          { name:'d2', type:'INTEGER', mode:'REQUIRED', description:'a required integer' }
        ]},
        { name:'e', type:'RECORD', mode:'REPEATED', description:'an array of objects', fields:[
          { name:'e1', type:'STRING', description:'a nullable string' },
          { name:'e2', type:'INTEGER', mode:'REQUIRED', description:'a required integer' }
        ]}
      ]
    }));
  }

  //test1();
  //test2();
  //test3();
  //test4();
  //test5();
  //test6();
  //test7();
  //test8();
  test9();
}
