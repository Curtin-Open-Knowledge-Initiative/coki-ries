/*
## Description
Print a structure table in the console from a set of objects (has a few more features than console.table)

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
function print_table(rows=[],cols=[]) {
  const draw_top     = () => { process.stdout.write(`┌─${cols.map(c =>             '─'.repeat(c.max)).join('─┬─')}─┐\n`); }
  const draw_divider = () => { process.stdout.write(`├─${cols.map(c =>             '─'.repeat(c.max)).join('─┼─')}─┤\n`); }
  const draw_bottom  = () => { process.stdout.write(`└─${cols.map(c =>             '─'.repeat(c.max)).join('─┴─')}─┘\n`); }
  const draw_fields  = () => { process.stdout.write(`│ ${cols.map(c =>    align_center(c.max,c.name)).join(' │ ')} │\n`); }
  const draw_row     = r  => { process.stdout.write(`│ ${cols.map(c => c.method(c.max,`${r[c.key]}`)).join(' │ ')} │\n`); }
  const align_left   = (max=0,s='') => s + ' '.repeat(max - (s+'').length);
  const align_right  = (max=0,s='') =>     ' '.repeat(max - (s+'').length) + s;
  const align_center = (max=0,s='') => {
    let diff = max - s.length;
    let left = Math.floor(diff/2);
    return ' '.repeat(left) + s + ' '.repeat(diff - left);
  }
  // set a default colsig if the user doesn't provide one
  if (cols.length == 0) {
    Object.keys(rows?.[0] ?? {}).forEach(name => cols.push({ name, align:'l' }));
  }
  // set initial widths and renderers
  cols.forEach((c,i) => {
    if (c.key   === undefined) c.key = c.name ?? i;
    if (c.name  === undefined) c.name = `${c.key}`;
    if (c.align === undefined) c.align = 'l';
    c.max = c.name.length;
    if      (c.align[0] == 'l') c.method = align_left;
    else if (c.align[0] == 'r') c.method = align_right;
    else                        c.method = align_center;
  });
  // set maximum width per column (needs a full table traversal)
  for (let r of rows) {
    for (let c of cols) {
      const k = c.key;
      const v = r[k] + '';
      if (v.length > c.max) c.max = v.length;
    }
  }
  // draw the table
  draw_top();
  draw_fields();
  draw_divider();
  rows.forEach(r => r ? draw_row(r) : draw_divider());
  draw_bottom();
}
module.exports = print_table;

// testing
if (require.main === module) {
  const table1 = [];
  for (let i=0; i<10; ++i) {
    table1.push({
      index  :i,
      integer: Math.floor(Math.random() * 100000),
      float  : Math.random(),
      string : '*'.repeat(Math.floor(Math.random() * 20))
    });
  }
  const table2 = table1.map(v => Object.values(v));
  print_table(table1);
  print_table(table2);
  print_table(table2, [
    {key:0, align:'c'},
    {key:1, align:'r'},
    {key:2, align:'r'},
    {key:3, align:'r'},
    {key:3, align:'l'},
  ]);
  print_table(table1, Object.keys(table1[0]).reverse().map(key => ({key,align:'c'})));
};

