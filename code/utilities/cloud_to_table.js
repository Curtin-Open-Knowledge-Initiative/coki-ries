/*
## Summary
Create a BigQuery table by importing it from Google Cloud Storage.

## Description
Arguments can be defined in the default configuration file or on the command line. The keyfile will 
require that the user has access to read objects and buckets from GCS. The source bucket is 
expected to have a schema file and one or more data files (the paths are defined by the user).

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/

const app = require('app');

async function cloud_to_table({name,replace}) {
  await app.db.create_from_bucket({ 
    link : app.link,
    name : name,
    bucket : 'rt-era-public',
    path_schema : `data/${name}/schema.json`,
    path_data : `data/${name}/data.jsonl`,
    replace : replace,
  });
}

if (require.main === module) {
  app.cli_run(cloud_to_table, {name:'',replace:''});
}