/*
## Summary
Compiles data for the ERA low volumne indicator. 

## Description
For methodology, see:
https://github.com/Curtin-Open-Knowledge-Initiative/for_benchmark_predictions/blob/main/docs/era_2018.md#indicator-low-volume-thresholds

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0

## Requires
table research_outputs_*

## Creates
table ind_ok_volume_*
*/
const app = require('app');
const compile = ({
  ns_core   = 'project.dataset',
  scope     = 'world',
  digits    = 4,
  threshold = 50,
  replace   = false,
}) => `
-- generated by: ${__filename}
BEGIN
  ${replace ? 'CREATE OR REPLACE TABLE' : 'CREATE TABLE IF NOT EXISTS'} \`${ns_core}.ind_ok_volume_${scope}_${digits}\` AS (
    SELECT institution, field, sum_papers
    FROM ${ns_core}.research_outputs_${scope}_${digits}_institution_field
    WHERE sum_papers >= ${threshold}
  );
END;`;
const compile_all = () => [ 
  compile({ ...app.conf(), scope:'world', digits:4 }),
  compile({ ...app.conf(), scope:'world', digits:2 }),
  compile({ ...app.conf(), scope:'local', digits:4 }),
  compile({ ...app.conf(), scope:'local', digits:2 }),
];
module.exports = { compile, compile_all };

if (require.main === module) compile_all().forEach(sql => console.log(sql));