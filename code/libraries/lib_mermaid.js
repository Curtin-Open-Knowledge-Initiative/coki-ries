/*
## Description
Load, save, compile and render a flow diagram using mermaid.js and Electron

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0

## Requires
## Creates

## Changes
2022-06-16: created
2022_07_20: refactored
*/
const file     = require('./lib_file');
const load     = (ifile)         => file.load(ifile);
const save     = (ofile,plot='') => file.save(ofile,plot);
// const renderer = file.resolve(__dirname,'../gui/mermaid/main.js');
// const render   = (ifile)         => require('node:child_process').execSync(`npx electron ${renderer} ${ifile}`);
const compile  = (edges=['','']) => {
  function format_node(s) {
    s = s.split(/\s/).join('_');
    if (s.startsWith('table_')) return (s+'[('+s+')]:::table').replaceAll('table_','');
    if (s.startsWith('file_') ) return (s+'{{'+s+'}}:::file' ).replaceAll( 'file_','');
    if (s.startsWith('exec_') ) return (s+'(' +s+ '):::exec' ).replaceAll( 'exec_','');
    return s;
  };
  const lines = [
    '%%{ init: { "theme":"forest", "themeVariables": { "fontFamily" : "helvetica" }}}%%',
    'graph LR',
    '  classDef table   fill:#DDF,stroke:#000;',
    '  classDef file    fill:#DFD,stroke:#000;',
    '  classDef exec    fill:#FDD,stroke:#000;',
    '  classDef default fill:#FFF,stroke:#000;',
  ];
  for (let [a,b] of edges) lines.push(`  ${format_node(a)} --> ${format_node(b)}`);
  return lines.join('\n');
}
function html(mermaid_string='') {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Flow Diagram</title>
    <style>
      body {
        font-family: Helvetica, Arial, sans-serif;
      }
      #mermaid_text {
        resize    : vertical;
        border    : solid black 1px;
        min-height: 100px;
        height    : 150px;
        width     : 100%;
        display   : inline-block; /* needed to stop editable from adding divs */
      }
      #mermaid_container {
        width    : 100%;
      }
      #mermaid_plot {
        width: 100%;
        overflow : scroll;
        border   : solid black 1px;
      }
      button {
        margin-right: 8px;
      }
      div {
        margin-bottom: 10px;
      }
      svg g p {
        background-color:lightgray;
        border-radius: 1em;
        padding:0.5em 1em;
        margin:0em;
        max-width: 20em;
        white-space: normal;
        font-size: 1em;
        display:block;
      }    
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/9.1.7/mermaid.min.js" integrity="sha512-1ypa9tdUrJAWv5g28Mb5x0zXaUuI4SBofKff88OGyk5D/oOd4x1IPxYHsx3K81bwBKt8NVUvGgw7TgNZ6PJX2A==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script>
      const state = { size : 100 };
      const gid = document.getElementById.bind(document);
      const els = {
        text : 'mermaid_text',
        plot : 'mermaid_plot',
        info : 'mermaid_info',
        exec : 'mermaid_exec',
        bigr : 'mermaid_bigr',
        smlr : 'mermaid_smlr',
        size : 'mermaid_size',
      };
      function error(e) {
        if (!e) return;
        console.error(e);
        alert("The following error has occurred: " + e.message);
        els.info.innerText = e.message;
      }
      function update(s) {
        if (s) els.text.value = s;
        try {
          els.plot.style.width = state.size + "%";
          els.plot.style.height = state.size + "%";
          els.plot.innerHTML = window.mermaid?.render('mermaid_tmp', els.text.value);
          els.plot.firstChild.removeAttribute('height'); // fix for mermaid quirk
          els.size.innerHTML = state.size + '%';
        }
        catch (e) { error(e); }
      }
      function resize(size) {
        if (size < 10 || size > 200) return;
        state.size = size;
        update();
      }
      function init(browser_window) {
        window.mermaid = browser_window.mermaid;
        for (let [k,v] of Object.entries(els)) {
          els[k] = gid(v);
        }
        els.exec.onclick = () => update();
        els.bigr.onclick = () => resize(state.size + 10);
        els.smlr.onclick = () => resize(state.size - 10);

        update(\`${mermaid_string}\`);
      }
    </script>
  </head>
  <body onload='init(this)'>
    <h1>Flow Diagram</h1>
    <div><pre id='mermaid_info'></pre></div>
    <div><textarea id='mermaid_text'></textarea></div>
    <div>
      <button id='mermaid_exec'>Update</button>
      <button id='mermaid_smlr'>&minus;</button>
      <button id='mermaid_bigr'>&plus;</button>
      <span id='mermaid_size'>100%</span>
    </div>
    <div id="mermaid_container">
      <div id='mermaid_plot'></div>
    </div>
  </body>
</html>`;
}

module.exports = { 
  load, save, 
  //render, 
  compile, html 
};
