/*
## Summary
Create and render a worflow diagram using mermaid.js and Electron

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const lib_dag  = require('../libraries/lib_dag');
const lib_mer  = require('../libraries/lib_mermaid');
const lib_file = require('../libraries/lib_file');

function compile() {
  const ifiles  = [].concat(
    lib_file.ls_files(lib_file.resolve(__dirname,'../loaders')),
    lib_file.ls_files(lib_file.resolve(__dirname,'../queries'))
  ).filter(s => s.endsWith('.js'));
  const dag = lib_dag.compile({ifiles});
  const str = lib_mer.compile(dag.edges);
  return str;
}

if (require.main === module) {
  const mer_text   = compile();
  const ofile_plot = lib_file.resolve(__dirname,'../../docs/workflow.html');
  const ofile_repo = lib_file.resolve(__dirname,'../../docs/workflow.md');
  
  lib_file.save(ofile_plot, lib_mer.html(mer_text));
  lib_file.save(ofile_repo, "```mermaid\n"+mer_text+"\n```\n");

  require('shelljs').exec(`open ${ofile_plot}`);
}
