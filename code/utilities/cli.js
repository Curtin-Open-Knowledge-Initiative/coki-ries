/*
## Summary
Launch a CLI for running specific queries or actions.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
module.exports = () => require('app').cli_run();
if (require.main === module) module.exports()
