/*
## Summary
Compile and print one of the templated SQL queries without running it.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const app = require('app');

function print({id}) {
  const files = {};
  app.file.ls_files(`${__dirname}/../queries`).filter(s => s.endsWith('.js')).sort().forEach((f,i) => {
    files[app.file.base(f)] = f;
    files[i] = f;
  });
  if (files[id]) {
    require(files[id]).compile(app.conf());
  }
  else {
    require('./query_list')();
    app.err(`unrecognised query ID: ${id}, please select from the list above and try again`);
  }
}
module.exports = print;

if (require.main === module) {
  print({id:process.argv[2]});
}
