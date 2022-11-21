/*
## Summary
Imports raw data from GCS into the papers table.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0

## Creates
table raw_papers
*/
const compile = ({
  ns_core = 'project.dataset',
  bucket  = 'gs://rt-era-public',
}) => `
-- generated by: ${__filename}
BEGIN
  CREATE OR REPLACE TABLE \`${ns_core}.raw_papers\` (
    doi   STRING  NOT NULL OPTIONS(description='Digital Object Identifier for the paper'),
    year  INTEGER NOT NULL OPTIONS(description='Year of publication'),
    cits  INTEGER NOT NULL OPTIONS(description='Number of accumulated citations to date'),
    is_oa BOOLEAN NOT NULL OPTIONS(description='True if the publication is recorded as Open Access'),
    type  STRING  NOT NULL OPTIONS(description='The type of the publication, currently only contains journal-articles'),
    issns ARRAY<STRING>    OPTIONS(description='List of ISSNs for the journal associated with this publication'),
    rors  ARRAY<STRING>    OPTIONS(description='List of ROR codes for institutions affiliated with this publication'),
  )                        OPTIONS(description='Extract of publication metadata from the COKI database');
  TRUNCATE TABLE \`${ns_core}.raw_papers\`;
  LOAD DATA INTO \`${ns_core}.raw_papers\` FROM FILES (
    format = 'JSON',
    uris = ['${bucket}/data/raw/raw_papers/*.jsonl.gz']
  );
END;
`;
const compile_all = (args={}) => [ compile(args) ];
module.exports = { compile, compile_all };
if (require.main === module) require('app').cli_compile(compile_all);
