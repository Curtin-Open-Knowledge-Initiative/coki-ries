/*
## Description
Provides app settings and shared functionality to all files that import it.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const lib_bigq   = require('./libraries/lib_bigquery');
const lib_file   = require('./libraries/lib_file');
const lib_json   = require('./libraries/lib_json');
const lib_type   = require('./libraries/lib_is');
const lib_cli    = require('./libraries/lib_cli'); // TODO: remove docopt dependency
const lib_str    = require('./libraries/lib_string');
const lib_web    = require('./libraries/lib_web');
const lib_cache  = require('./libraries/lib_cache');
const {execSync} = require('node:child_process');

const log = (...s) => !console.log((new Date()).toTimeString().split(' ')[0], '-', ...s);
const out = (...s) => !console.log(...s);
const err = (...s) => !!console.error((new Date()).toTimeString().split(' ')[0], '-', 'ERROR:', ...s);
const die = (...s) => { err(...s); process.exit(1); }
const msg = (...s) => conf().verbose ? log(...s) : false;

const homedir = lib_file.resolve(__dirname,'../');
const datadir = lib_file.resolve(__dirname,'../data');
const docfile = lib_file.resolve(__dirname,'../docs/usage.md'); // documentation for the CLI may be found here
lib_cache.set_home(datadir);

if (!exec('curl -V'))  die('this app requires curl to be available at the command line');
if (!exec('unzip -v')) die('this app requires unzip to be available at the command line');

// wrapper around shelljs.exec (TODO: remove this dependency)
function exec(str) {
  try { return execSync(str).toString(); }
  catch (e) { return false; }
}

// wrapper around basic CLI cURL usage (TODO: remove this dependency)
function curl(url, ofile=resolve(datadir,'.cache/temp.txt')) {
  return exec(`curl --location --max-redirs 3 --output ${resolve(ofile)} '${url}'`);
}

// download to a file or to stdout
async function download(url,ofile) {
  return lib_web.download(url,resolve(ofile));
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
function plot() {
  out('NOT YET IMPLEMENTED');
}

// run a query with an option to use the cache
async function query(sql='', args={}) {
  args = conf(args);

  if (args.dryrun) {
    if (args.verbose) out(sql);
    return [null,null];
  }

  const link = lib_bigq.connect(args);

  // check for validly formed connection settings
  try {
    await link.bq.createQueryJob({query:'select 1'});
  }
  catch (e) {
    die(`unable to connect.
    - Is the network accessible?
    - Is this keyfile valid? ${args.keyfile}
    - Does this project exist in BigQuery? ${args.project}
    - Do the project permissions allow table creation?
    `);
  }

  // execute the query
  try {
    if (args.verbose) out(sql);
    if (!args.docache) {
      return await lib_bigq.query(link,sql);
    }
    else {
      const file = resolve(`data/cache_${lib_cache.hash(sql)}.jsonlr`);
      if (exists(file)) return load(file);
      const res = await lib_bigq.query(link,sql);
      save(res,file);
      return res;
    }
  }
  catch (e) {
    return [e,null];
  }
}

// functions used by the command line interface
const cli = {
  
  // parse command line arguments
  parse : () => lib_cli.parse_args(),

  // run a given function using the CLI settings with an optional override and additional params. If no function is provided, it will look for one in the args list
  run : async (func=null, overrides={}, ...extras) => {
    const args = conf(overrides);
    const util = args._args[0]
    if (args.help || args.h || args['?'] || util == '?') return cli.help();
    if (args.usage || args.u) return cli.usage();
    if (!func && !util) return cli.usage();
    switch (util) {
      case 'help': return cli.help();
      case 'usage': return cli.usage();
      case 'options': return cli.options();
      case 'version': return cli.version();
    }
    
    // if no function has been provided, look for a matching utility
    if (!func) {
      const file = resolve(`code/utilities/${util}.js`);
      if (!exists(file)) return cli.usage();
      func = require(file);
    }
    let results = await func(args, ...extras);
    if (args.verbose && results?.forEach) {
      results.forEach(v => console.log(v));
    }
  }, 
  
  compile : async (func,overrides={}) => {
    const args = conf(overrides);
    const sqls = func(args);
    
    // run the queries
    for (let sql of sqls) {
      let [error,result] = await query(sql,args);
      if (args.verbose) {
        if (error) err(error);
        if (result) out(result);
      }
    }
  }, 

  help : () => {
    const docs = lib_str.get_between(load(docfile),'```docs', '```').trim();
    out(docs);
  },

  usage : () => {
    const docs  = lib_str.get_between(load(docfile),'```docs', '```').trim();
    const text = lib_str.get_between(docs,"Usage:", "Options", true, false).trim();
    out(text);
  },

  options : () => {
    const docs  = lib_str.get_between(load(docfile),'```docs', '```').trim();
    const text = lib_str.get_between(docs,"Options:", "Functions", true, false).trim();
    out(text);
  },

  version : () => {
    const docs  = lib_str.get_between(load(docfile),'```docs', '```').trim();
    const text = lib_str.get_between(docs,"Version:", "\n", true, false).trim();
    out(text);
  }
}

// application configuration
const conf = new function() {

  // library of checking functions
  const types = {
    file  : { cast: v => ''+v, test: v => v == '' || lib_type.is.File(v)                         , info: 'must be an existing file'                                },
    bool  : { cast: v =>  !!v, test: v => lib_type.is.Bool(v)                                    , info: 'must be a boolean or truthy value'                       },
    year  : { cast: v =>   +v, test: v => lib_type.is.Int(v) && v>=1500 && v<=2100               , info: 'must be an integer between 1500 and 2100'                },
    term  : { cast: v => ''+v, test: v => lib_type.is.Rex(v,/^[0-9a-zA-Z_\-]+$/)                 , info: 'must be a string with only the characters [a-zA-Z0-9_-]' },
    bucket: { cast: v => ''+v, test: v => lib_type.is.Rex(v,/^gs:\/\/([\w\-\.]+)(\/[\w\-\.]+)*$/), info: 'must be a Google Storage address, eg: gs://my-bucket'    },
    ror   : { cast: v => ''+v, test: v => lib_type.is.Rex(v,/^https:\/\/ror.org\/[0-9a-z]{9}$/)  , info: 'must be a ROR address, eg: https://ror.org/02n415q13'    },
  };

  // config schema and defaults
  const def_access_file = resolve('setup/.access.json');
  const def_config_file = resolve('setup/.config.json');
  const schema = {
    confile : { default: def_config_file            , type: 'file'  , info: 'path to a configuration file for the application'                                },
    keyfile : { default: def_access_file            , type: 'file'  , info: 'path to a BigQuery credentials file (or symlink)'                                },
    project : { default: 'ries'                     , type: 'term'  , info: 'the BigQuery project-id that the application has permission to access'           },
    dataset : { default: 'demo'                     , type: 'term'  , info: 'the BigQuery dataset-id that the application has permission to modify tables in' },
    bucket  : { default: 'gs://rt-era-public'       , type: 'bucket', info: 'address of the COKI Google Cloud Storage bucket where datafiles may be found'    },
    replace : { default: false                      , type: 'bool'  , info: 'set to true to replace tables if they exist (or use the --replace CLI flag)'     },
    verbose : { default: true                       , type: 'bool'  , info: 'set to true to log most activity (or use the --verbose CLI flag)'                },
    dryrun  : { default: true                       , type: 'bool'  , info: 'set to true to print queries but not run them (or use the --dryrun CLI flag)'    },
    docache : { default: false                      , type: 'bool'  , info: 'set to true to use a local cache for queries (avoids re-running)'                },
    debug   : { default: false                      , type: 'bool'  , info: 'set to true to print some debugging information such as config settings'         },
    start   : { default: 2000                       , type: 'year'  , info: 'years before this value will be excluded from the analysis'                      },
    finish  : { default: 2022                       , type: 'year'  , info: 'years after this value will be excluded from the analysis'                       },
    rorcode : { default: 'https://ror.org/02n415q13', type: 'ror'   , info: 'the ROR identifier for an institution that you want to study'                    },
  };

  // validate in incoming object against the schema
  function validate(obj={}) {
    for (let [key,val] of Object.entries(obj)) {
      if (!schema[key]) continue;
      const {cast,test,info} = types[schema[key].type];
      if (!test(cast(val))) die(`invalid setting -> ${key} = ${val}. The value ${info}.`);
      obj[key] = cast(val);
    }
    return obj;
  }

  // get the default config
  function get_args_def() {
    return Object.fromEntries(Object.keys(schema).map(key => [key,schema[key].default]));
  }

  // get config from a JSON file
  function get_args_file(ifile='') {
    try { return ifile ? lib_json.load(lib_file.resolve(ifile)) : {}; }
    catch (e) { die(`unable to load config file at: ${lib_file.resolve(ifile)}`); }
  }

  // get config from CLI args
  function get_args_cli() {
    const {named,unnamed} = cli.parse();
    named._args = unnamed;
    return named;
  }

  // assemble the final state of the arguments
  function get_args() {
    // ensure that the default access and config files exist
    if (!exists(def_config_file)) lib_file.save(def_config_file, lib_json.human(get_args_def()));
    if (!exists(def_access_file)) lib_file.save(def_access_file, lib_json.human({
      "type"                        : "service_account",
      "project_id"                  : "<project_name>",
      "private_key_id"              : "<key_id>",
      "private_key"                 : "-----BEGIN PRIVATE KEY-----\n<key_text>\n-----END PRIVATE KEY-----\n",
      "client_email"                : "<user_name>@<project_name>.iam.gserviceaccount.com",
      "client_id"                   : "<user_id>",
      "auth_uri"                    : "https://accounts.google.com/o/oauth2/auth",
      "token_uri"                   : "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url" : "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url"        : "https://www.googleapis.com/robot/v1/metadata/x509/<user_name>%40<project_name>.iam.gserviceaccount.com"
    }));

    // get args from the different sources
    const args_1 = get_args_def();                // hard-coded default have the lowest priority: 1
    const args_2 = get_args_file(args_1.confile); // assuming the hard-coded default config file exists, it gets priority: 2
    const args_4 = get_args_cli();                // values, specified by the user at the command line, get priority: 4
    const args_3 = get_args_file(args_4.confile); // if the user specified a config file at the command line, this gets priority: 3

    return validate(Object.assign({}, args_1, args_2, args_3, args_4));
  }

  const args_base = get_args();

  function update(updates={}) {
    const args = Object.assign({}, args_base, updates);
    args.ns_core = `${args.project}.${args.dataset}`;
    args.ns_inst = `${args.project}.${args.dataset}_inst`;
    if (args.debug) out(args);
    return validate(args);
  }
  return update;
}

module.exports = {
  db   : lib_bigq,
  file : lib_file,
  log, err, msg, out,
  resolve, reserve, exists, load, save,
  download, curl, exec, plot, query, 
  cli_run : cli.run, 
  cli_compile : cli.compile,
  conf
};

if (require.main === module) {
  cli.run();
}