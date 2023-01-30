/*
## Description
Utilities for working with JSON, JSONL and JSONLR data and files

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const file = require('./lib_file');
const json = {

  // standard JSON handling
  load : (f)   => json.decode(file.load(f)),
  save : (f,v) => file.save(f, json.encode(v)),
  encode : (v) => JSON.stringify(v) + file.EOL,
  human  : (v) => JSON.stringify(v,null,2) + file.EOL,
  decode : (s) => JSON.parse(s),
  print  : (v) => console.log(JSON.stringify(v,null,1)),
  to_jsonl  : (s,d) => json.l.save(d, json.load(s)),
  to_jsonlr : (s,d) => json.lr.save(d, json.load(s)),
  to_csv    : (s,d) => json.csv.save(d, json.load(s)),

  // JSONL format (full object per line)
  l : {
    load : (f)   => json.l.decode(file.load(f)),
    save : (f,a) => file.save(f, json.l.encode(a)),
    encode : (a) => a.map(json.encode).join(''),
    decode : (s) => s.split(file.EOL).filter(v=>v).map(json.decode),
    to_json   : (s,d) => json.save(d, json.l.load(s)),
    to_jsonlr : (s,d) => json.lr.save(d, json.l.load(s)),
    to_csv    : (s,d) => json.csv.save(d, json.l.load(s)),
  },

  // JSONLR format (keys on the first line, values on every other line)
  lr : {
    load : (f)   => json.lr.decode(file.load(f)),
    save : (f,a) => file.save(f, json.lr.encode(a)),
    encode : (a) => {
      let keys = Object.keys(a[0]);
      let vals = a.map(v => Object.values(v));
      return json.l.encode([keys, ...vals]);
    },
    decode : (s) => {
      let [keys, ...rows] = json.l.decode(s);
      return rows.map(row => Object.fromEntries(row.map((v,i) => [keys[i],v])));
    },
    to_json  : (s,d) => json.save(d, json.lr.load(s)),
    to_jsonl : (s,d) => json.l.save(d, json.lr.load(s)),
    to_csv   : (s,d) => file.save_lines(d, file.load_lines(s).map(line => line.substring(1,line.length-1))),
  },

  // conversion between CSV and JSONLR. Don't use this for CSVs that were not created with this lib
  csv : {
    load : (f) => {
      let [keys, ...rows] = file.load_lines(f).map(v => JSON.parse(`[${v}]`));
      return rows.map(row => Object.fromEntries(row.map((v,i) => [keys[i],v])));
    },
    save : (f,a) => {
      const lines = [];
      const push = array => {
        let line = JSON.stringify(array);
        lines.push(line.substring(1,line.length-1) + file.EOL);
      };
      a.forEach(obj => {
        if (lines.length == 0) push(Object.keys(obj));
        push(Object.values(obj));
      });
      file.save(f, lines.join(''));
    },
    to_json   : (s,d) => json.save(d, json.csv.load(s)),
    to_jsonl  : (s,d) => json.l.save(d, json.csv.load(s)),
    to_jsonlr : (s,d) => file.save_lines(d, file.load_lines(s).map(line => `[${line}]`)),
  },
};
module.exports = json;

if (require.main === module) {
  const assert = require('assert');
  const data = [
    { one:1, two:2, three:3 },
    { one:1, two:2, three:3 },
    { one:1, two:2, three:3 },
  ];
  json.save('test1',data);
  json.l.save('test2',data);
  json.lr.save('test3',data);
  json.csv.save('test4',data);

  json.csv.to_jsonlr('test4','test5');
  json.lr.to_csv('test3','test6');

  let data1 = json.load('test1');
  let data2 = json.l.load('test2');
  let data3 = json.lr.load('test3');
  let data4 = json.csv.load('test4');
  let data5 = json.lr.load('test5');
  let data6 = json.csv.load('test6');

  assert(JSON.stringify(data1) == JSON.stringify(data));
  assert(JSON.stringify(data2) == JSON.stringify(data));
  assert(JSON.stringify(data3) == JSON.stringify(data));
  assert(JSON.stringify(data4) == JSON.stringify(data));
  assert(JSON.stringify(data5) == JSON.stringify(data));
  assert(JSON.stringify(data6) == JSON.stringify(data));

  file.remove('test1');
  file.remove('test2');
  file.remove('test3');
  file.remove('test4');
  file.remove('test5');
  file.remove('test6');

  console.log('tests finished');
}