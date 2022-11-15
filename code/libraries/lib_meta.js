/* 
## Description
Extract metadata for a file from the comments at the head of the file (like this one). Markdown headers will be picked up as metadata keys (always converted to lower case) and the lines between each key picked up as the value. It's up to a downstream metadata receiver to assign meaning to various tags (for example, the dag runner uses ## requires and ## creates to form edges in a DAG.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const file = require('./lib_file');
const {get_between} = require('./lib_string');

// parse metadata from the top of a file (located in the first comment block /* */
function parse_file(ifile) {
  const comment = get_between(file.load(ifile),"/*","*/");
  return Object.assign({ file:ifile }, parse(comment));
}
// parse metadata from a collection of files
function parse_files(ifiles=[]) {
  return ifiles.map(parse_file);
}
// parse metadata from a string
function parse(str='') {
  let meta = {};
  let name = '';
  for (let line of str.split("\n")) {
    if (line.trim()[0] == '#') {
      name = line.replace(/^[#\s]*/,'').toLowerCase();
      meta[name] = '';
    }
    else {
      if (line.trim() != '') meta[name] += line + "\n";
    }
  }
  return meta;
}
module.exports = { parse_files, parse_file, parse };