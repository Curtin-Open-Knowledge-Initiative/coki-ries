/*
## Summary
(NOT YET IMPLEMENTED) Create a summary report for all Australian HEPs.

## Description

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0

## Requires

## Creates
*/
const app = require('app');
const compile = ({
  ns_core   = 'project.dataset',
  ns_inst   = 'project.dataset',
  replace   = false,
}) => `
-- generated by: ${__filename}
-- NOT YET IMPLEMENTED
`;
const compile_all = () => [ compile(app.conf()) ];
module.exports = { compile, compile_all };

if (require.main === module) compile_all().forEach(sql => console.log(sql));
