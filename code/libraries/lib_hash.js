/*
## Description
A few helper functions for hashing

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const crypto = require('crypto');
const file = require('./lib_file');
const hash = {
  sha256 : v => crypto.createHash('sha256').update(v).digest('hex'),
  path   : v => hash.sha256(file.resolve(v)),
  file   : v => hash.sha256(file.load(v)),
  text   : v => hash.sha256(v),
};
module.exports = hash;