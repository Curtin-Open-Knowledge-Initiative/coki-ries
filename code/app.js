/*
## Description
Provides app settings and shared functionality to all files that import it.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const lib_bigq = require('./libraries/lib_bigquery');
const lib_file = require('./libraries/lib_file');
const lib_json = require('./libraries/lib_json');
const lib_str  = require('./libraries/lib_string');
const lib_type = require('./libraries/lib_is');
const lib_cli  = require('./libraries/lib_cli'); // TODO: remove docopt dependency
const cache    = require('./libraries/lib_cache');
const shelljs  = require('shelljs'); // TODO: remove dependency
shelljs.config.silent = true;

const log = (...s) => !console.log((new Date()).toTimeString().split(' ')[0], '-', ...s);
const err = (...s) => !!console.error((new Date()).toTimeString().split(' ')[0], '-', 'ERROR:', ...s);
const msg = (...s) => app.conf.query_args.verbose ? log(...s) : false;
const out = (...s) => !console.log(...s);

const homedir = lib_file.resolve(__dirname,'../');
const datadir = lib_file.resolve(__dirname,'../data');
const docfile = lib_file.resolve(__dirname,'../docs/usage.md'); // documentation for the CLI may be found here
cache.set_home(datadir);

if (!shelljs.which('curl'))  err('this app requires curl to be available at the command line');
if (!shelljs.which('unzip')) err('this app requires unzip to be available at the command line');

// wrapper around shelljs.exec (TODO: remove this dependency)
function exec(str) {
  return shelljs.exec(str) + '';
}

// wrapper around basic CLI cURL usage (TODO: remove this dependency)
function curl(url, ofile=resolve(datadir,'.cache/temp.txt')) {
  return exec(`curl '${url}' -o ${resolve(ofile)}`);
}

// resolve a file path relative to the project home directory
function resolve(...relparts) {
  const relpath = lib_file.join(...relparts);
  const abspath = relpath.startsWith(homedir) ? lib_file.resolve(relpath) : lib_file.resolve(homedir,relpath);
  return abspath.startsWith(homedir) ? abspath : err('specified path is outside the project:',abspath);
}

// determine if a file or directory exists relative to the project home directory
function exists(...relparts) {
  const abspath = resolve(...relparts);
  return abspath && lib_file.exists(abspath);
}

// reserve a path within the project (create it if it does not yet exist)
function reserve(...relparts) {
  const path = resolve(...relparts);
  if (path) lib_file.mkdir(path);
  return path;
}

// load a file relative to the project root (creates path if needed)
function load(...relparts) {
  const relpath = lib_file.join(...relparts);
  const abspath = resolve(relpath);
  if (!abspath || !exists(abspath)) return err('unable to load from this location:', lib_file.resolve(relpath));
  switch (lib_file.ext(abspath).toLowerCase()) {
    case '.js'    : return require(abspath);
    case '.json'  : return lib_json.load(abspath);
    case '.jsonl' : return lib_json.l.load(abspath);
    case '.jsonlr': return lib_json.lr.load(abspath);
    case '.csv'   : return lib_file.load_csv(abspath);
    case '.lines' : return lib_file.load_lines(abspath);
    default       : return lib_file.load(abspath);
  }
}

// save a file relative to the project root (creates path if needed)
function save(data='', ...relparts) {
  const relpath = lib_file.join(...relparts);
  const abspath = resolve(relpath);
  if (!abspath || !lib_file.mk(abspath)) return err('unable to save at this location:', lib_file.resolve(relpath));
  switch (lib_file.ext(abspath).toLowerCase()) {
    case '.json'  : return lib_json.save(abspath,data);
    case '.jsonl' : return lib_json.l.save(abspath,data);
    case '.jsonlr': return lib_json.lr.save(abspath,data);
    case '.csv'   : return lib_json.csv.save(abspath,data);
    case '.lines' : return lib_file.save_lines(abspath,data);
    default       : return lib_file.save(abspath,data);
  }
}

// not implemented yet
function plot() {}

// run a given function using the CLI settings with an optional override and additional params
async function cli_run(func='', overrides={}, ...extras) {
  const args = conf(overrides);
  if (!func) {
    const funcname = args.funcname ?? args._args?.[0] ?? '';
    if (!funcname) {
      return;
      //return err('please specify which command you want to call');
    }
    const file = resolve(`code/utilities/${funcname}.js`);
    if (!exists(file)) {
      return err('could not find specified utility',file);
    }
    func = require(file);
  }
  return await func(args, ...extras);
}
async function cli_query_exec(generator,args={}) {
  await generator({...conf(),...args});
}
function dryrun(generator,args={}) {
  out(generator({...conf(),...args,dryrun:true}));
}

// run a query with an option to use the cache
async function query(sql='', args={}) {
  args = conf(args);

  if (args.verbose) out(sql);
  if (args.dryrun) return [null,[]];
  const link = lib_bigq.connect(args);
  
  if (!args.docache) {
    return await lib_bigq.query(link,sql);
  }
  else {
    const file = resolve(`data/cache_${cache.hash(sql)}.jsonlr`);
    if (exists(file)) return load(file);
    const res = await lib_bigq.query(link,sql);
    save(res,file);
    return res;
  }
}

// application configuration
const conf = new function() {

  // library of checking functions
  const types = {
    dir   : { cast: v => ''+v, func: v => lib_type.is.Dir(v)                                     , info: 'must be an existing directory'                           },
    file  : { cast: v => ''+v, func: v => lib_type.is.File(v)                                    , info: 'must be an existing file'                                },
    bool  : { cast: v =>  !!v, func: v => lib_type.is.Bool(v)                                    , info: 'must be a boolean or truthy value'                       },
    year  : { cast: v =>   +v, func: v => lib_type.is.Int(v) && v>=1500 && v<=2100               , info: 'must be an integer between 1500 and 2100'                },
    term  : { cast: v => ''+v, func: v => lib_type.is.Rex(v,/^[0-9a-zA-Z_\-]+$/)                 , info: 'must be a string with only the characters [a-zA-Z0-9_-]' },
    bucket: { cast: v => ''+v, func: v => lib_type.is.Rex(v,/^gs:\/\/([\w\-\.]+)(\/[\w\-\.]+)*$/), info: 'must be a Google Storage address, eg: gs://my-bucket'    },
    ror   : { cast: v => ''+v, func: v => lib_type.is.Rex(v,/^https:\/\/ror.org\/[0-9a-z]{9}$/)  , info: 'must be a ROR address, eg: https://ror.org/02n415q13'    },
  };

  // config schema and defaults
  const schema = {
    keyfile : { default: resolve('setup/.keyfile.json'), test: types.file  , info: 'path to a BigQuery credentials file (or symlink)'                                },
    project : { default: ''                            , test: types.term  , info: 'the BigQuery project-id that the application has permission to access'           },
    dataset : { default: 'ries_demo'                   , test: types.term  , info: 'the BigQuery dataset-id that the application has permission to modify tables in' },
    bucket  : { default: 'gs://rt-era-public'          , test: types.bucket, info: 'address of the COKI Google Cloud Storage bucket where datafiles may be found'    },
    replace : { default: false                         , test: types.bool  , info: 'set to true to replace tables if they exist (or use the --replace CLI flag)'     },
    verbose : { default: false                         , test: types.bool  , info: 'set to true to log most activity (or use the --verbose CLI flag)'                },
    dryrun  : { default: false                         , test: types.bool  , info: 'set to true to print queries but not run them (or use the --dryrun CLI flag)'    },
    docache : { default: false                         , test: types.bool  , info: 'set to true to use a local cache for queries (avoids re-running)'                },
    debug   : { default: false                         , test: types.bool  , info: 'set to true to print some debugging information such as config settings'         },
    start   : { default: 2000                          , test: types.year  , info: 'years before this value will be excluded from the analysis'                      },
    finish  : { default: 2022                          , test: types.year  , info: 'years after this value will be excluded from the analysis'                       },
    rorcode : { default: 'https://ror.org/02n415q13'   , test: types.ror   , info: 'the ROR identifier for an institution that you want to study'                    },
  };

  // verify that an incoming object has legal values
  function verify(obj={}) {
    for (let [key,val] of Object.entries(obj)) {
      if (schema[key] !== undefined) {
        obj[key] = schema[key].test.cast(val);
        if (!check(key,obj[key])) return false;
      }
    }
    return true;
  }

  // check a particular configuration setting
  function check(key,val) {
    return (schema[key] === undefined || schema[key].test.func(val)) ? true : err(`Invalid config (${key} = ${val}). The value ${schema[key].test.info}`);
  }

  // print an informative error if a config value is not being set correctly
  function print_error(key,val) {
    err(`Invalid config (${key} = ${val}). The value ${schema[key].test.info}`);
  }

  // get the default config
  function args_get_default() {
    const args = Object.fromEntries(Object.keys(schema).map(key => [key,schema[key].default]));
    check('keyfile',args.keyfile);
    args.project = require(args.keyfile).project_id;
    return args;
  }

  // load args from the config file
  function args_get_from_file() {
    if (exists('setup/.config.json')) return load('setup/.config.json');
    if (exists('setup/.config.js'))   return load('setup/.config.js');
    if (exists('setup/config.json'))  return load('setup/config.json');
    if (exists('setup/config.js'))    return load('setup/config.js');
    return {};
  }

  // parse args from command line variables
  function args_get_from_cli() {
    return require.main === module ? args_get_from_cli_docopt() : args_get_from_cli_simple();
  }
  function args_get_from_cli_docopt() {
    try {
      const docs = lib_str.get_between(load(docfile),'```docs', '```').trim();
      const usage = lib_str.get_between(docs,"Usage:", "cli [options]", true, true);
      return lib_cli.parse_args_docopt(docs);
    }
    catch (e) {
      console.log(e.message);
      return {};
    }
  }
  function args_get_from_cli_simple() {
    const {named,unnamed} = lib_cli.parse_args();
    named._args = unnamed;
    return named;
  }
  
  // get the final args
  const args_base = args_get_default();
  const args_file = args_get_from_file(); // settings from the conf file override the defaults
  const args_cli  = args_get_from_cli();  // settings from the CLI override the conf file

  if (!verify(args_base)) process.exit();
  if (!verify(args_file)) process.exit();
  if (!verify(args_cli))  process.exit();

  return (overrides={}) => {
    const args = Object.assign({}, args_base, args_file, args_cli, overrides);
    args.ns_core = `${args.project}.${args.dataset}`;
    args.ns_inst = `${args.project}.${args.dataset}_inst`;
    if (args.debug) console.log(args);
    return verify(args) ? args : null;
  }
}

module.exports = {
  db   : lib_bigq,
  file : lib_file,
  log, err, msg, out,
  resolve, reserve, exists, load, save,
  curl, exec, plot, query, 
  cli_run, cli_query_exec, dryrun,
  conf
};

if (require.main === module) {
  cli_run();
}