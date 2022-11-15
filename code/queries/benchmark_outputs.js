/*
## Summary
Compiles data for the ERA research outputs indicator.

## Description
For methodology, see:
https://github.com/Curtin-Open-Knowledge-Initiative/for_benchmark_predictions/blob/main/docs/era_2018.md#indicator-research-outputs
https://github.com/Curtin-Open-Knowledge-Initiative/for_benchmark_predictions/blob/main/docs/era_2018.md#indicator-research-outputs-by-year

When all combinations are used, this will produce 32 different tables.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0

## Requires
table research_outputs_base

## Creates
table research_outputs_*
*/
const app = require('app');
const compile = ({
  ns_core = 'project.dataset',
  scope   = 'world',
  digits  = 4,
  institution = true,
  field   = true,
  year    = true,
  replace = false,
}) => {
  let group = [institution ? 'institution' : '', field ? 'field' : '', year ? 'year' : ''].filter(v=>v);
  let table = `${ns_core}.research_outputs_${scope}_${digits}_${group.join('_')}`;
  return `
-- generated by: ${__filename}
BEGIN
  -- create outputs table ${scope} ${digits}digit (${group})
  ${replace ? 'CREATE OR REPLACE TABLE' : 'CREATE TABLE IF NOT EXISTS'} \`${table}\` AS (
    SELECT 
      ${group.join(',')},
      COUNT(1)  AS sum_papers,
      SUM(cits) AS sum_citations,
      SUM(frac) AS sum_portions,
      AVG(cits) AS avg_citations,
      NTILE(100) OVER (PARTITION BY field,year ORDER BY COUNT(1)  DESC) AS cent_papers,
      NTILE(100) OVER (PARTITION BY field,year ORDER BY SUM(cits) DESC) AS cent_citations,
      NTILE(100) OVER (PARTITION BY field,year ORDER BY SUM(frac) DESC) AS cent_portions,
      NTILE(100) OVER (PARTITION BY field,year ORDER BY AVG(cits) DESC) AS cent_cpp,
      RANK()     OVER (PARTITION BY field,year ORDER BY COUNT(1)  DESC) AS rank_papers,
      RANK()     OVER (PARTITION BY field,year ORDER BY SUM(cits) DESC) AS rank_citations,
      RANK()     OVER (PARTITION BY field,year ORDER BY SUM(frac) DESC) AS rank_portions,
      RANK()     OVER (PARTITION BY field,year ORDER BY AVG(cits) DESC) AS rank_cpp
    FROM (
      SELECT
        ${institution ? 'inst'  : 'null'} AS institution,
        ${field       ? 'field' : 'null'} AS field,
        ${year        ? 'year'  : 'null'} AS year, 
        ANY_VALUE(frac) AS frac, 
        ANY_VALUE(cits) AS cits
      FROM \`${ns_core}.research_outputs_world_base\`
      WHERE LENGTH(field) >= ${digits} ${scope == 'local' ? 'AND is_hep' : ''}
      GROUP BY paper,institution,field,year
    )
    -- this works because of the ternary operations in the internal select
    GROUP BY institution,field,year
    ORDER BY institution,field,year
  );
  -- sanity checks
  SELECT 'test', COUNT(1) AS total, ${group.map(g => `COUNT(DISTINCT ${g}) AS num_${g}s`).join(',')} FROM \`${table}\`;
END;
`;}
function compile_all() {
  const args = app.conf();
  const sqls = [];
  ['world','local'].forEach(scope => 
    [4,2].forEach(digits => {
      sqls.push(compile({ ...args, scope, digits, institution: true, field: true, year: true }));
      sqls.push(compile({ ...args, scope, digits, institution: true, field: true, year:false }));
      sqls.push(compile({ ...args, scope, digits, institution: true, field:false, year: true }));
      sqls.push(compile({ ...args, scope, digits, institution:false, field: true, year: true }));
      sqls.push(compile({ ...args, scope, digits, institution: true, field:false, year:false }));
      sqls.push(compile({ ...args, scope, digits, institution:false, field: true, year:false }));
      sqls.push(compile({ ...args, scope, digits, institution:false, field:false, year: true }));
    })
  );
  return sqls;
}
module.exports = { compile, compile_all };

if (require.main === module) compile_all().forEach(sql => console.log(sql));
