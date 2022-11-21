/*
## Summary
Compile and print one of the templated SQL queries without running it.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const app = require('app');

function print({id='',_args=[]}) {
  if (!id) id = _args.pop();
  const files = {};
  app.file.ls_files(`${__dirname}/../queries`).filter(s => s.endsWith('.js')).sort().forEach((f,i) => {
    files[app.file.base(f)] = f;
    files[i] = f;
  });
  if (files[id]) {
    const func = require(files[id]).compile_all;
    app.cli_compile(func, { verbose:true, dryrun:true });
  }
  else {
    require('./query_list')();
    app.err(`unrecognised query ID: ${id}, please select from the list above and try again`);
  }
}
module.exports = print;

if (require.main === module) {
  app.cli_run(print);
}
