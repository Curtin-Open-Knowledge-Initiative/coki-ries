const {conf,resolve,exists,load,query,err,out} = require('app');
const {get_between} = require('./libraries/lib_string');
const docfile = resolve(__dirname,'../docs/usage.md'); // documentation for the CLI may be found here


// run a given function using the CLI settings with an optional override and additional params. If no function is provided, it will look for one in the args list
async function run(func=null, overrides={}, ...extras) {
  const args = conf(overrides);
  const util = args._args[0]
  if (args.help || args.h || args['?'] || util == '?') return help();
  if (args.usage || args.u) return usage();
  if (!func && !util) return usage();
  
  // if no function has been provided, look for a matching utility
  if (!func) {
    const file = resolve(`code/utilities/${util}.js`);
    if (!exists(file)) return usage();
    func = require(file);
  }
  let results = await func(args, ...extras);
  if (args.verbose && results?.forEach) {
    results.forEach(v => console.log(v));
  }
}

async function compile(func,overrides={}) {
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
}

function help() {
  const docs = get_between(load(docfile),'```docs', '```').trim();
  out(docs);
}

function usage() {
  const docs  = get_between(load(docfile),'```docs', '```').trim();
  const usage = get_between(docs,"Usage:", "Options", true, false).trim();
  out(usage);
}

module.exports = { usage, help, compile, run };

if (require.main === module) {
  run();
}