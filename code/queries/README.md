# Templated SQL Queries

Functions for generating fully-formed SQL queries from parameterised string templates. These can be directly run from the command line, or included as generator functions. By default, if you invoke a query compiler directly at the command line, then it will be set to `--dryrun`. All other settings will be inherited from the base config. Queries can also be generated and run via the general CLI tool `npm run cli`.

Example:

```bash
cd code/queries

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
