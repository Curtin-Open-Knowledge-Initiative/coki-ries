/*
## Summary
Imports raw data from GCS into the ERA historical ratings table.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0

## Requires
file coki.cloud

## Creates
table era_historical_ratings
*/
const compile = ({
  ns_core = 'project.dataset',
  bucket  = 'gs://rt-era-public',
}) => `
-- generated by: ${__filename}
BEGIN
  CREATE OR REPLACE TABLE \`${ns_core}.era_historical_ratings\` (
    hep_code STRING NOT NULL OPTIONS(description='short-code for the Australian institution (higher education provider)'),
    hep_name STRING NOT NULL OPTIONS(description='institution name'),
    for_vers STRING NOT NULL OPTIONS(description='version of the field of research codes being used'),
    for_code STRING NOT NULL OPTIONS(description='field of research code'),
    for_name STRING NOT NULL OPTIONS(description='field of research name'),
    era_2010 STRING NOT NULL OPTIONS(description='ERA rating assigned in 2010 (NA = not assessed)'),
    era_2012 STRING NOT NULL OPTIONS(description='ERA rating assigned in 2012 (NA = not assessed)'),
    era_2015 STRING NOT NULL OPTIONS(description='ERA rating assigned in 2015 (NA = not assessed)'),
    era_2018 STRING NOT NULL OPTIONS(description='ERA rating assigned in 2018 (NA = not assessed)'),
  )                          OPTIONS(description='Official ERA outcomes table from: https://dataportal.arc.gov.au/ERA/Web/Outcomes#/institution/');
  TRUNCATE TABLE \`${ns_core}.era_historical_ratings\`;
  LOAD DATA INTO \`${ns_core}.era_historical_ratings\` FROM FILES (
    format = 'JSON',
    uris = ['${bucket}/data/raw/era_historical_ratings/data.jsonl']
  );
END;
`;
const compile_all = (args={}) => [ compile(args) ];
module.exports = { compile, compile_all };
if (require.main === module) require('app').cli_compile(compile_all);
