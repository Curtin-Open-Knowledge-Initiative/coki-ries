/*
## Description
Various utilities/helpers for working with files.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const fs = require('fs');
const path = require('path');
const file = {
  EOL        : require('os').EOL,
  load_csv   : require('./lib_csv.js').load,
  resolve    : (...s) => path.resolve(path.join(...s)),
  join       : (...s) => path.join(...s),
  dir        : (f) => path.dirname(f),
  ext        : (f) => path.extname(f),
  name       : (f) => path.basename(f),
  base       : (f) => path.basename(f).split(path.extname(f)).join(''),
  exists     : (f) => fs.existsSync(f),
  stat       : (f) => fs.statSync(f),
  size       : (f) => file.stat(f).size,
  load       : (f) => file.exists(f) ? fs.readFileSync(f).toString() : '',
  save       : (f,s) => fs.writeFileSync(f,s),
  remove     : (f) => file.exists(f) ? fs.unlinkSync(f) : '',
  load_lines : (f) => file.load(f).split(file.EOL).filter(v=>v),
  save_lines : (f,a) => file.save(f,a.filter(v=>v).join(file.EOL) + file.EOL),
  age_days   : (f) => file.exists(f) ? (Date.now() - fs.statSync(f).ctimeMs) / (1000*60*60*24) : null,
  is_file    : (f) => file.exists(f) && file.stat(f).isFile(),
  is_dir     : (f) => file.exists(f) && file.stat(f).isDirectory(),
  ls         : (f) => file.is_dir(f) ? fs.readdirSync(f).map(ff => file.resolve(f,ff)) : [],
  ls_files   : (f) => file.ls(f).filter(file.is_file),
  mkdir      : (f) => (file.is_dir(f)  || (!file.exists(f) &&  fs.mkdirSync(f,{recursive:true})) ? f : ''),
  mkfile     : (f) => file.is_file(f) || (!file.exists(f) && !fs.closeSync(fs.openSync(f,'a'))),
  mk         : (f) => file.mkdir(file.dir(f)) && file.mkfile(f),
};
module.exports = file;

if (require.main === module) {
  const assert = require('assert');
  const k = __filename + '.test';
  const v = 'test contents';

  function test() {
    if (file.exists(k)) file.remove(k);
    assert(file.exists(k) === false);
    file.save(k,v);
    assert(file.exists(k));
    assert(file.load(k) === v);
    file.remove(k);
    assert(file.exists(k) === false);
    console.log('tests passed');
  }
  test();
}