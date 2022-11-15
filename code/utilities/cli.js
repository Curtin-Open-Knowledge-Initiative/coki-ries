/*
## Summary
Launch a CLI for running specific queries or actions.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const app = require('app');

async function main() {
  const conf = app.conf();
  if (!conf.funcname) return;
  const file = app.resolve(`${__dirname}/${conf.funcname}.js`);
  require(`${file}`);
}
module.exports = main;

if (require.main === module) {
  main();
}