/*
## Description
Helper functions for working with Objects

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
function zip(keys,vals) {
  return Object.fromEntries(keys.map((k,i) => [k,vals[i]]));
}
function deep_copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function deep_check(args,defs,parent='') {
  for (let [k,v] of Object.entries(defs)) {
    if (args[k] === undefined) continue;
    if (v.constructor !== args[k].constructor) return `${parent}${k}`;
    if (typeof v === 'object') {
      let err = deep_check(args[k],v,k+'.');
      if (err) return err;
    }
  }
  return '';
}
function deep_assign(args,defs) {
  for (let [k,v] of Object.entries(defs)) {
    if (args[k] === undefined) args[k] = JSON.parse(JSON.stringify(v));
    else if (typeof v === 'object') deep_assign(args[k],v);
  }
  return args;
}
function map(obj,func) {
  return Object.fromEntries(Object.entries(obj).map(kp => func(kp[0],kp[1])).filter(v=>v));
}
module.exports = { zip, deep_copy, deep_check, deep_assign };
