/*
  Copy this file to `config.js` then make changes to the copy. If you do not want to expose config 
  settings, then ensure that the copy is not under version control (.gitignore).
*/
module.exports = {

  /*
    The application uses these directories for caching, to avoid re-running some queries or 
    processes. Files in these directories can be deleted at any time and are not under version 
    control. 
  */
  tempdir : `${__dirname}/../temp`, // absolute path to temp directory (default: {repo}/temp)
  datadir : `${__dirname}/../data`, // absolute path to data directory (default: {repo}/data)

  /*
    BigQuery connection details for your database instance.

    NOTE: be careful if putting your keyfile inside the project directory. Ensure that .gitignore 
    is successfully excluding your file to avoid accidentally committing it to the repo. A better 
    idea is keep it in a different location, for example as a .dotfile in your home directory. By 
    default, files named conf/credentials* or conf/key* will be ignored by Git.
  */
  database : {
    keyfile : `${__dirname}/credentials.json`, // BigQuery credentials file. Must be ABSOLUTE path.
    project : 'your_project_id', // BigQuery project name. Must already exist.
    dataset : 'your_dataset_id', // BigQuery dataset name. Created if needed.
  },

  // these parameters are used when constructing templated SQL queries
  query_args : {
    replace   : false, // if true, queries will overwrite existing tables
    verbose   : true,  // if true, prints SQL queries to the screen as they execute
    dryrun    : true,  // if true, prints SQL queries but does not run them (overrides verbose)
    start     : 2016,  // generate no data before this year
    end       : 2021,  // generate no data after this year

    // single institution analysis. Leave blank to skip
    inst_name : '', // short name for the institution to analyse, eg: 'curtin'
    inst_code : '', // ROR code of the institution to analyse, eg: 'https://ror.org/02n415q13'
  },
}
