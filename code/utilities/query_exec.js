/*
## Summary
Compile and print one of the templated SQL queries without running it.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const app = require('app');

async function exec({id='ping'}) {
  const files = {};
  app.file.ls_files(`${__dirname}/../queries`).filter(s => s.endsWith('.js')).sort().forEach((f,i) => {
    files[app.file.base(f)] = f;
    files[i] = f;
  });
  if (files[id]) {
    let sql = require(files[id]).compile_all().join("\n");
    let [err,res] = await app.query(sql);
    err ? console.error(err) : console.log(res);
  }
  else {
    require('./query_list')();
    app.err(`unrecognised query ID: ${id}, please select from the list above and try again`);
  }
}
module.exports = exec;

if (require.main === module) {
  app.cli_run(exec);
}
