/*
## Description
Get text between two boundary patterns (option to include or exclude a boundary)

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
function get_between(str='', a='', b='', inc_a=false, inc_b=false) {
  let posA = str.indexOf(a);
  if (posA == -1) return '';
  let posB = str.indexOf(b,posA+a.length);
  if (posB == -1) return '';
  return str.substring(
    posA + (inc_a ? 0 : a.length),
    posB + (inc_b ? b.length : 0)
  );
}
function trim_left(str='',regex=/\s/) {
  let pos =0;
  while (str[pos].search(regex) !== -1) { ++pos; };
  return pos == 0 ? str : str.substring(pos);
}
function trim_right(str='',regex=/\s/) {
  let pos = str.length - 1;
  while (str[pos].search(regex) !== -1) { --pos; }
  return pos == str.length - 1 ? str : str.substring(0,pos+1);
}
module.exports = { get_between, trim_left, trim_right };