/*
## Summary
Prepares a core list of institutions from the Research Organization Registry (ROR).

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0

## Requires
table raw_rors

## Creates
table core_rors
*/
const app = require('app');
const compile = ({
  ns_core = 'project.dataset',
  replace = false,
}) => `
-- generated by: ${__filename}
BEGIN 
  ${replace ? 'CREATE OR REPLACE TABLE' : 'CREATE TABLE IF NOT EXISTS'} \`${ns_core}.core_rors\` AS (
    SELECT 
      ror,
      since,
      status ,
      country,
      name,
      IFNULL(type_0,'') AS type_0,
      IFNULL(link_0,'') AS link_0,
      types,
      links  
    FROM ${ns_core}.raw_rors
    ORDER BY name
  );
  ALTER TABLE \`${ns_core}.core_rors\` SET OPTIONS(description='Official Research Organisation Registry data sourced from https://ror.readme.io/docs/data-dump');
  ALTER TABLE ${ns_core}.core_rors
  ALTER COLUMN ror     SET OPTIONS (description='Research Organisation Registry unique identifier'),
  ALTER COLUMN since   SET OPTIONS (description='The year that the institution was established'),
  ALTER COLUMN status  SET OPTIONS (description='Current status of the institution (filter for active)'),
  ALTER COLUMN type_0  SET OPTIONS (description='Primary activity type (ie, types[0])'),
  ALTER COLUMN country SET OPTIONS (description='Country in which the research institution is located'),
  ALTER COLUMN name    SET OPTIONS (description='Name of the research institution'),
  ALTER COLUMN link_0  SET OPTIONS (description='Primary URL (ie, links[0])'),
  ALTER COLUMN types   SET OPTIONS (description='All activity types that the institution is engaged in'),
  ALTER COLUMN links   SET OPTIONS (description='All links associated with the institution');

  -- tests
  SELECT
    'there should be no nulls or empty strings' AS description,
    IF(COUNTIF(ror     IS NULL OR ror     = '') = 0, 'pass', 'fail') AS test1,
    --IF(COUNTIF(since   IS NULL OR since   =  0) = 0, 'pass', 'fail') AS test2,
    IF(COUNTIF(status  IS NULL OR status  = '') = 0, 'pass', 'fail') AS test3,
    IF(COUNTIF(country IS NULL OR country = '') = 0, 'pass', 'fail') AS test4,
    IF(COUNTIF(name    IS NULL OR name    = '') = 0, 'pass', 'fail') AS test5,
    IF(COUNTIF(type_0  IS NULL ) = 0, 'pass', 'fail') AS test6,
    IF(COUNTIF(link_0  IS NULL ) = 0, 'pass', 'fail') AS test7,
    IF(COUNTIF(types   IS NULL ) = 0, 'pass', 'fail') AS test8,
    IF(COUNTIF(links   IS NULL ) = 0, 'pass', 'fail') AS test9
  FROM \`${ns_core}.core_rors\`;
END;
`;
const compile_all = () => [ compile(app.conf()) ];
module.exports = { compile, compile_all };

if (require.main === module) compile_all().forEach(sql => console.log(sql));
