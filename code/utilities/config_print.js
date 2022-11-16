/*
## Summary
Print the config

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const app = require('app');
module.exports = () => app.out(JSON.stringify(app.conf(),null,2));
if (require.main === module) module.exports();
