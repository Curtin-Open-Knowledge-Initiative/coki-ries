/*
## Summary
Compiles RCI score ranges (used when assigning performance categories).

## Description
Prior to this stage, each output will have been assigned an RCI score. Based on the RCI score, the 
output can then be assigned to a performance category. The table created here defines the score 
boundaries for each category.

Prior to ERA 2023, there were 7 RCI categories (0:uncited through to 6:highest). The category 
boundaries were statically defined (hard-coded) and were the same for all element groupings.

Since ERA 2023, there are 6 RCI categories (0:uncited through to 5:highest). The category 
boundaries are dynamically computed for all element groupings.

Methods:
https://github.com/Curtin-Open-Knowledge-Initiative/for_benchmark_predictions/blob/main/docs/era_2018.md#indicator-distribution-of-papers-by-rci-classes

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0

## Requires
table rci_papers

## Creates
table benchmarks_rci_*
*/
// TODO: implement the wildcard.
const compile = ({
  ns_core = 'project.dataset',
  digits  = 4,
  replace = false,
}) => `
-- generated by: ${__filename}
BEGIN
  -- creates a table with the upper boundary RCI value for dynamic RCI categories
  ${replace ? 'CREATE OR REPLACE TABLE' : 'CREATE TABLE IF NOT EXISTS'} \`${ns_core}.benchmarks_rci_world_${digits}\` AS (
    WITH 
    cat0 AS (SELECT   field,   year,              0 AS upper FROM \`${ns_core}.rci_papers\`                                                                   WHERE LENGTH(  field) >= ${digits}                           GROUP BY field, year), -- 0 (uncited)
    cat1 AS (SELECT   field,   year, AVG(rci_world) AS upper FROM \`${ns_core}.rci_papers\`                                                                   WHERE LENGTH(  field) >= ${digits}                           GROUP BY field, year), -- mean RCI > 0 (which should be 1.0)
  --cat1 AS (SELECT A.field, A.year, AVG(rci_world) AS upper FROM \`${ns_core}.rci_papers\` AS A LEFT JOIN cat0 AS B ON A.field = B.field AND A.year = B.year WHERE LENGTH(A.field) >= ${digits} AND A.rci_world > B.upper GROUP BY field, year), -- mean RCI > 0 (higher than 1.0 due to excluding 0s)
    cat2 AS (SELECT A.field, A.year, AVG(rci_world) AS upper FROM \`${ns_core}.rci_papers\` AS A LEFT JOIN cat1 AS B ON A.field = B.field AND A.year = B.year WHERE LENGTH(A.field) >= ${digits} AND A.rci_world > B.upper GROUP BY field, year), -- mean RCI > cat 1
    cat3 AS (SELECT A.field, A.year, AVG(rci_world) AS upper FROM \`${ns_core}.rci_papers\` AS A LEFT JOIN cat2 AS B ON A.field = B.field AND A.year = B.year WHERE LENGTH(A.field) >= ${digits} AND A.rci_world > B.upper GROUP BY field, year), -- mean RCI > cat 2
    cat4 AS (SELECT A.field, A.year, AVG(rci_world) AS upper FROM \`${ns_core}.rci_papers\` AS A LEFT JOIN cat3 AS B ON A.field = B.field AND A.year = B.year WHERE LENGTH(A.field) >= ${digits} AND A.rci_world > B.upper GROUP BY field, year), -- mean RCI > cat 3
    cat5 AS (SELECT   field,   year, MAX(rci_world) AS upper FROM \`${ns_core}.rci_papers\`                                                                   WHERE LENGTH(  field) >= ${digits}                           GROUP BY field, year)  -- maximum RCI
    SELECT
      cat0.field,
      cat0.year,
      cat5.upper AS max_rci,

      0.00 AS s_c0, -- uncited
      0.80 AS s_c1, -- the element is in category 1 if its RCI <= 0.8
      1.20 AS s_c2,
      2.00 AS s_c3,
      4.00 AS s_c4,
      8.00 AS s_c5,
      cat5.upper AS s_c6, -- technically this should be infinity (using max observed instead)

      cat0.upper AS d_c0, -- uncited
      cat1.upper AS d_c1, -- the element is in category 1 if its RCI <= dynamic_c1
      cat2.upper AS d_c2,
      cat3.upper AS d_c3,
      cat4.upper AS d_c4,
      cat5.upper AS d_c5  -- technically this should be infinity (using max observed instead)

    FROM cat0
    LEFT JOIN cat1 ON cat0.field = cat1.field AND cat0.year = cat1.year
    LEFT JOIN cat2 ON cat0.field = cat2.field AND cat0.year = cat2.year
    LEFT JOIN cat3 ON cat0.field = cat3.field AND cat0.year = cat3.year
    LEFT JOIN cat4 ON cat0.field = cat4.field AND cat0.year = cat4.year
    LEFT JOIN cat5 ON cat0.field = cat5.field AND cat0.year = cat5.year
    ORDER BY field,year
  );
END;
`;
const compile_all = (args={}) => [ 
  compile({ ...args, digits:4 }),
  compile({ ...args, digits:2 }),
];
module.exports = { compile, compile_all };
if (require.main === module) require('app').cli_compile(compile_all);
