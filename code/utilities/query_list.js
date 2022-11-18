/*
## Summary
Print a list of available templated queries.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const app = require('app');
const lib_file = require('../libraries/lib_file');
const lib_meta = require('../libraries/lib_meta');
const print_table = require('../libraries/lib_console');

function build() {
  return lib_file.ls_files(`${__dirname}/../queries`).filter(s => s.endsWith('.js')).sort().map((file,index) => ({
    code : index,
    file : file,
    name : lib_file.base(file), 
    info : lib_meta.parse_file(file).summary?.split("\n").join(' ').trim() ?? ''
  }));
}
function print() {
  print_table(build(), [
    { key:'code', align:'r', name:'ID' },
    { key:'name', align:'l', name:'Filename' },
    { key:'info', align:'l', name:'Description' },
  ]);
}
module.exports = print, build;

if (require.main === module) {
  app.cli_run(print);
}
