/*
## Summary
Print the config

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const app = require('app');
module.exports = () => {
  let conf = app.conf();
  conf.keyfile = app.relative(conf.keyfile);
  conf.confile = app.relative(conf.confile);
  app.out(JSON.stringify(conf,null,2));
}
if (require.main === module) module.exports();
