/*
## Description
Compiles a workflow that builds the rt-era project. The output file contains a set of nodes and edges

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const file = require('./lib_file');
const meta = require('./lib_meta');
const path = require('path');
const exec = require('node:util').promisify(require('node:child_process').exec);

// compile a dag given a set of files (or directories)
function compile_dag({ifiles}) {

  // extract metadata objects from a set of files
  function extract_metas(ifiles) {
    return meta.parse_files(ifiles).map(m => ({
      filename : 'exec ' + path.basename(m.file),
      requires : (m.requires ?? '').split("\n").map(s => s.trim()).filter(s => s),
      creates  : (m.creates  ?? '').split("\n").map(s => s.trim()).filter(s => s),
    }));
  }

  // compile a collection of metadata into a graph (nodes and edges)
  function compile(metas) {
    const Node = name => ({ n_out:0, n_in:0, name });
    const root  = Node('root');
    const sink  = Node('sink');
    const nodes = {};
    const edges = [];

    // extract nodes and edges
    for (let meta of metas) {
      nodes[meta.filename] = Node(meta.filename);
      meta.requires.forEach(nameA => {
        nodes[nameA] ??= Node(nameA);
        edges.push([nameA,meta.filename]);
      });
      meta.creates.forEach(nameB => {
        nodes[nameB] ??= Node(nameB);
        edges.push([meta.filename,nameB]);
      });
    }

    // adjust connection counts
    for (let [a,b] of edges) {
      nodes[a].n_out++;
      nodes[b].n_in++;
    }
    
    // connect source nodes to the root
    for (let node of Object.values(nodes)) {
      if (node.n_in == 0 && node.n_out > 0) { // excludes files with no associations
        node.n_in++;
        root.n_out++;
        edges.unshift(['root',node.name]);
      }
    }
    nodes['root'] = root;
    return {nodes,edges};
  }
  return compile(extract_metas(ifiles));
}

// given a pre-compiled dag, run it
function run_dag(dag={}, options={}) {
  const state = {
    retries : 3,
  };
  
  async function exec_dag(root) {
    const nodes = {};
    traverse_df_async(root, node => nodes[node] = {completed:false});
    traverse_bf_async(root, exec_node);
  }
  async function traverse_df_async(root={}, func=async()=>{}) {
    const visited = new Set();
    const stack = [root];
    while (stack.length > 0) {
      const node = stack.pop();
      if (typeof node !== 'object' || node === null || visited[node]) return;
      visited[node] = true;
      await func(node);
      stack.concat(Object.values(node).reverse());
    }
  }
  async function traverse_bf_async(root={}, func=async()=>{}) {
    const visited = new Set();
    const queue = [root];
    while (queue.length > 0) {
      const node = queue.shift();
      if (typeof node !== 'object' || node === null || visited[node]) return;
      visited[node] = true;
      await func(node);
      queue.concat(Object.values(node));
    }
  }
  async function exec_node(dag_node={}) {
    switch (dag_node?.type ?? 'unknown') {
      case 'js' : handler = exec_nodejs  ; break;
      case 'sql': handler = exec_bigquery; break;
      default   : handler = exec_default ; break;
    }
    for (let i=0; i<state.retries; ++i) {
      let error = await handler(dag_node);
      if (!error) break;
    }
  }
  async function exec_default(dag_node={}) {
    return null;
  }
  async function exec_bigquery(dag_node={}) {
    return exec_command(`node run_bigquery.js ${dag_node}.filename`);
  }
  async function exec_nodejs(dag_node={}) {
    return exec_command(`node ${dag_node}.filename`);
  }
  async function exec_command() {
    if (cmd) return exec(cmd);
  }
}

function save_dag(ofile,dag={}) {
  file.save(ofile, JSON.stringify(dag,null,1));
}

function load_dag(ifile='') {
  return file.exists(ifile) ? JSON.parse(file.load(ifile)) : {};
}

module.exports = {
  compile : compile_dag,
  execute : run_dag,
  save : save_dag,
  load : load_dag,
};

// test
if (require.main === module) {
  const idir   = file.resolve(__dirname,'../actions');
  const ofile  = file.resolve(__dirname,'../gui/mermaid/demo_dag.txt');
  const ifiles = file.ls_files(idir).filter(f => ['.sql','.js'].includes(file.ext(f)));
  const dag    = compile_dag({ifiles});
}
