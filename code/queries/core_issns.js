/*
## Summary
Prepares a core list of linking ISSNs.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0

## Requires
table raw_issns

## Creates
table core_issnls
table xref_issn_issnl

*/
const compile = ({
  ns_core = 'project.dataset',
  replace = false,
}) => `
-- generated by: ${require('path').basename(__filename)}
BEGIN 
  ${replace ? 'CREATE OR REPLACE TABLE' : 'CREATE TABLE IF NOT EXISTS'} \`${ns_core}.core_issnls\` AS (
    SELECT 
      issnl,
      ARRAY_AGG(issn) AS issns 
    FROM ${ns_core}.raw_issns
    WHERE issnl IS NOT NULL AND ISSNL != ''
    GROUP BY issnl 
    ORDER BY issnl ASC
  );
  ALTER TABLE \`${ns_core}.core_issnls\` SET OPTIONS(description="Official ISSN-L -> ISSN mapping from https://www.issn.org/wp-content/uploads/2014/03/issnltables.zip");
  ALTER TABLE ${ns_core}.core_issnls
  ALTER COLUMN issnl SET OPTIONS (description="Linking ISSN"),
  ALTER COLUMN issns SET OPTIONS (description="List of ISSN values associated with the linking ISSN");

  ${replace ? 'CREATE OR REPLACE TABLE' : 'CREATE TABLE IF NOT EXISTS'} \`${ns_core}.xref_issn_issnl\` AS (
    SELECT 
      issnl,
      issn
    FROM ${ns_core}.raw_issns
    WHERE issnl IS NOT NULL AND issn IS NOT NULL AND issnl != '' AND issn != ''
    GROUP BY issnl,issn
    ORDER BY issnl,issn
  );
  ALTER TABLE \`${ns_core}.xref_issn_issnl\` SET OPTIONS(description="XREF table connecting ISSN values to ISSN-L values. Source: https://www.issn.org/wp-content/uploads/2014/03/issnltables.zip");
  ALTER TABLE ${ns_core}.xref_issn_issnl
  ALTER COLUMN issnl SET OPTIONS (description="Linking ISSN"),
  ALTER COLUMN issn  SET OPTIONS (description="ISSN value associated with the linking ISSN");
END;
`;
const compile_all = (args={}) => [ compile(args) ];
module.exports = { compile, compile_all };
if (require.main === module) require('app').cli_compile(compile_all);
