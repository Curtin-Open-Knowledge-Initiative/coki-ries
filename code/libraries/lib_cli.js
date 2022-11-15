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
  const opts = docopt(docs,{
    version: docs.match(/version:(.*)\n/i)?.[1].trim() ?? '1.0'
  });
  const args = {};

  for (let [k,v] of Object.entries(opts)) {
    if (k.startsWith('--')) k = k.substring(2);
    if (k.startsWith('<') && k.endsWith('>')) k = k.substring(1,k.length-1);
    args[k] = v;
  }
  return args;
}

// parse command line arguments (not using docopt)
function parse_args(args=process.argv.slice(2)) {
  return Object.fromEntries(args.map(kp => {
    let [k,v] = kp.split('=');
    if (k.startsWith('--')) k = k.substring(2);
    if (v !== undefined) {
      try   { v = JSON.parse(v); }
      catch { v = JSON.parse(`"${v}"`); }
    }
    return [k,v];
  }));
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


// // test
// if (require.main === module) {
//   const docs = `
//     Title: Some Program
    
//     Version: v1.0.1
    
//     Decription: A program that does stuff
    
//     Usage:
//       program tcp <host> <port> [--timeout=40]
//       program serial <port> [ --baud=9600 ] [--timeout=40]
//       program -h | --help | --version
    
//     Examples:
    
//     Options:
//       -t,--timeout=X  time out in seconds.
//       -b,--baud=X     baud rate [default: 70000].
//   `;
//   const api = {
//     tcp    : ({host='localhost', port='80', timeout='30'}) => console.log('tcp', host, +port, +timeout),
//     serial : ({port='80', baud='9600', timeout='30'}) => console.log('serial', +port, +baud, +timeout),
//   };
//   process_cli(docs,api);
// }

// function repeat(n,f) {
//   for (let i=0; i<n; ++i) f();
// }

// const api = {
//   echo   : (str) => console.log(str),
//   repeat : (str,int) => repeat(int, () => api.echo(str)),
//   exec   : (str) => process.exec(str),
//   random : ({min=0, max=1, places=3}) => api.echo((Math.random() * (max-min) + min).toFixed(places)),
// }
