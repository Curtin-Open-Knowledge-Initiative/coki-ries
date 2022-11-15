/*
## Description
Fully load a CSV file

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const fs = require('fs');
const EOL = require('os').EOL;
const csv = require('@fast-csv/parse');

function load(ifile) {
  return new Promise((y,n) => {
    let rows = [];
    fs.createReadStream(ifile)
      .pipe(csv.parse({ headers: true }))
      .on('error', e  => n(e))
      .on('end'  , () => y(rows))
      .on('data' , r  => rows.push(r))
    ;
  });
}
function load_compat(ifile) {
  const [keys,...rows] = fs.readFileSync(ifile).toString().split(EOL).map(s => JSON.parse('['+s+']'));
  return rows.map(vals => Object.fromEntries(keys.map((key,i) => [key,vals[i]])));
}
function save(ofile,objects) {    
  const line = s => s.substring(1,s.length-1) + EOL;
  const keys = o => line(JSON.stringify(Object.keys(o)));
  const vals = o => line(JSON.stringify(Object.values(o)));
  fs.writeFileSync(ofile, [keys(objects[0]), ...(objects.map(vals))].join(''));
}
module.exports = { load, save };

//test
if (require.main === module) {
  async function test() {
    const assert = require('assert');
    let ifile = '../../data/ERA_2023_journal_list.csv';
    assert(fs.existsSync(ifile));
    let rows = await load(ifile);
    console.log(rows[0]);
    console.table(rows.slice(0,1000));
  }
  test();
}
