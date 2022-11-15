/*
## Summary
Compile and run one of the templated SQL queries.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const app = require('app');
const list = require('./query_list.js');

function exec({id}) {
  const file = list.filter(id);
  if (!file) {
    list.print();
    app.err(`unrecognised query ID, please select from the list above and try again`);
  }
  else {
    const sql  = require(file).compile_all(args);
    //app.query(sql,args);
  }
}
module.exports = exec;

if (require.main === module) exec({id:process.argv[2]});
