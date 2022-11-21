/*
## Summary
TODO: not implemented yet
Plot a particular ERA-like indicator

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const app = require('app');

async function load_data(sql='') {
  return ;//await app.query(sql);
}

async function draw_plot(type='indicator', data=[]) {
  app.plot(data);
}

async function render(type='indicator', sql='') {
  await draw_plot(await load_data(sql));
}
module.exports = render;

if (require.main === module) {
  const type = 'indicator';
  const sql = 'select * from table';
  render(type,sql);
}
