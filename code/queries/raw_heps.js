/*
## Summary
Imports raw data from GCS into the HEPs table.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0

## Creates
table raw_heps
*/
const compile = ({
  ns_core = 'project.dataset',
  bucket  = 'gs://rt-era-public',
}) => `
-- generated by: ${__filename}
BEGIN
  CREATE OR REPLACE TABLE \`${ns_core}.raw_heps\` (
    ror  STRING OPTIONS(description='Research Organisation Registry unique identifier'),
    name STRING OPTIONS(description='Name of the research institution'),
  )             OPTIONS(description='List of Australian Higher Education Providers (HEPs) focused on by the ERA process');
  TRUNCATE TABLE \`${ns_core}.raw_heps\`;
  LOAD DATA INTO \`${ns_core}.raw_heps\` FROM FILES (
    format = 'JSON',
    uris = ['${bucket}/data/raw/raw_heps/data.jsonl']
  );
END;`;
const compile_all = (args={}) => [ compile(args) ];
module.exports = { compile, compile_all };
if (require.main === module) require('app').cli_compile(compile_all);
