/*
## Summary
Test if the current config can successfully connect to the BigQuery instance

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const app = require('app');

async function test_connection(args={}) {
  args = Object.assign(args,{dryrun:false,verbose:false});
  app.log('TESTING CONNECTION');
  let [err,res] = await app.query('SELECT DISTINCT catalog_name FROM INFORMATION_SCHEMA.SCHEMATA', args);
  app.log(err ? 'FAILURE' : 'SUCCESS');
  return [err,res];
}
module.exports = test_connection;

if (require.main === module) test_connection(app.conf());
