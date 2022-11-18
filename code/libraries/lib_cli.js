/*
## Description
Experimental: prototyping a little docopt helper routine (process_cli). Call this program from the command line to test

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const lib_obj = require('./lib_object');
const lib_str = require('./lib_string');
const lib_file = require('./lib_file');
const docopt = require('docopt');

// parse command line arguments with docopt
function parse_args_docopt(docs) {
  const opts = docopt.docopt(docs,{
    version: docs.match(/version:(.*)\n/i)?.[1].trim() ?? '1.0',
    help : true,
    exit : false,
  });
  const args = {};
  for (let [k,v] of Object.entries(opts)) {
    if (!v) continue;
    k = k.toLowerCase();
    if      ( k.startsWith('--')) { args[k.substring(2)]            = v; }
    else if ( k.startsWith('<'))  { args[k.substring(1,k.length-1)] = v; }
    else if (!k.startsWith('-'))  { args.funcname                   = k; }
  }
  return args;
}

// parse command line arguments into a dict of named args, and an array of unnamed args
function parse_args(args = process.argv.slice(2)) {
  const named = {};
  const unnamed = [];
   
  let key = null;
  let val = null;

  function push() {
    if (key !== null || val !== null) {
      if (val === null) val = true;
      try   { val = JSON.parse(    val   ); }
      catch { val = JSON.parse(`"${val}"`); }
      key === null ? unnamed.push(val) : named[key] = val;
      key = null;
      val = null;
    }
  }
  for (let arg of args) {
    if (arg.startsWith('-')) {
      push();
      key = arg.substring(arg.startsWith('--') ? 2 : 1);
      if (key.includes('=')) {
        val = key.substring(key.indexOf('=') + 1);
        key = key.substring(0, key.indexOf('='));
        push();
      }
    }
    else {
      val = arg;
      push();
    }
  };
  push();
  return {named,unnamed};
}

// lightly verify and assign command line arguments from a default object
function verify_args(args,defs={}) {
  let err = lib_obj.deep_check(args,defs);
  return err ? [err,null] : [null, lib_obj.deep_assign(args,defs)];
}

// load docs from a local README file
function load_docs(ifile='README.md',start='```clidocs',end='```') {
  let str = lib_file.load(ifile);
  if (str.includes(start)) {
    str = lib_str.get_between(str,start,end).trim();
  }
  console.log(str);
}

module.exports = { parse_args, parse_args_docopt, verify_args };

// test
if (require.main === module) {
  
  function test1() {
    let docs = load_docs('../utilities/README.md');
    let args = parse_args();
    let defs = {
      n : 1,
      s : 'string',
      t : true,
      f : false,
      a : [1,2,3],
      o : {n:1,s:'str'}
    };
    console.log(args);
    let [err,safe] = verify_args(args,defs);
    if (err) {
      console.error('ERROR: this command line parameter is not set correctly:',err);
    }
    console.log(safe);
    // node lib_cli.js n=1 s='str' t=true f=false a=[1,2,3] o='{"n":1,"s":"str","v":true}'
  }

  function test2() {
    const args = [
      'blah',
      'second',
      '--ifile',
      'a',
      '--ofile=b',
      'asdf',
      '--last',
      '[1, 2, 3, 4]',
      '-v',
      'true',
      'false',
      `{"a":1}`,
      '-x',
      'false',
      '-y',
      '-z='
    ];
    console.log(args.join(' '));
    console.log(parse_args(args));
  }
  test2();
}
