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
  args = app.conf(args);
  if (args.verbose) app.out('TESTING CONNECTION ->', args);
  let [err,res] = await app.query('SELECT DISTINCT catalog_name FROM INFORMATION_SCHEMA.SCHEMATA', args);
  if (args.verbose) (err 
    ? app.out('FAILED ->', err.errors)
    : app.out('SUCCESS ->', res)
  );
  return [err,res];
}
module.exports = test_connection;

if (require.main === module) {
  test_connection({
    dryrun  : false,
    verbose : true,
  });
}
