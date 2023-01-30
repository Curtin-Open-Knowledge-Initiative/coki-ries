# Templated SQL Queries

Each file in this directory compiles fully-formed SQL queries from template strings. Each query compiler may be run, stand-alone, from the command line, or may be imported as a function. If you want to print a query to the screen, without executing it, then ensure that `--dryrun true` and `--verbose true`. This is the default unless specified otherwise, but it's good to check in advance with `npm run cli config_print`.

Example:

```bash
cd code/queries

# check config status (in this example, downstream queries will assume --dryrun true and --verbose true.
npm run cli config_print

# print SQL to the console, using variables from your config file
node benchmark_centiles

# copy a query to the clipboard (linux)
node benchmark_centiles | pbcopy
```

To include a query as a function in some other code:

```js
const sql = require('./path/to/query_file.js')({
  // optional config overrides
  replace : true,
  execute : false,
  verbose : false,
});
console.log(sql);
```
