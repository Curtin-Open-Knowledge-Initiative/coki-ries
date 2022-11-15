/*
## Description
Basic type checking

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const fs = require('fs');

function tname(t) { return t?.name ?? (t === null ? 'null' : 'undefined'); }
function vname(v) { return v?.constructor?.name ?? (v === null ? 'null' : 'undefined'); }
function vtype(v) { return v?.constructor ?? (v === null ? null : undefined); }

function print_trace(msg) { console.error(['', msg, '', ...(new Error().stack.split("\n").slice(2).filter(s => !s.includes(__filename)))].join("\n")); return false; }

function check     (t,v) { return check_bool(t,v); }
function check_bool(t,v) { return t === vtype(v); }
function check_warn(t,v) { return check_bool(t,v) || print_trace(`ERROR: A value of type '${vname(v)}' was received. It should be of type '${tname(t)}'`); }
function check_fail(t,v) { return check_warn(t,v) || process.exit(1); }

function mode_bool() { check = check_bool; } mode_bool();
function mode_fail() { check = check_fail; }
function mode_warn() { check = check_warn; }

function is(t,v) { return check(t,v); }
function may (bool, msg='') { return bool || !!print_trace(msg || `ERROR: assertion failed`); }
function must(bool, msg='') { return may(bool,msg) || process.exit(); }

function cast_match(val,target) {
  return cast(val,vtype(target));
}
function cast(val,to_type) {
  if (vtype(val) === to_type) return val;
  val = JSON.parse(val+'');
  if (vtype(val) === to_type) return val;
}

is.File = (p) => fs.existsSync(p) && fs.statSync(p).isFile();
is.Dir  = (p) => fs.existsSync(p) && fs.statSync(p).isDirectory();
is.NonEmptyString = (s) => is(String,s) && s !== '';
is.Bool = v => is(Boolean,v);
is.Int = v => Number.isInteger(v);
is.Rex = (s,r) => r.test(s);

module.exports = { is, may, must, tname, vname, vtype, mode_bool, mode_fail, mode_warn, cast, cast_match };

// tests
if (require.main === module) {

  const test = res => res ? console.log('test passed') : print_trace('test failed');
  const is   = module.exports.is;
  const heading = msg => {
    console.log();
    console.log('#'.repeat(msg.length + 12));
    console.log(`##### ${msg} #####`);
    console.log('#'.repeat(msg.length + 12));
  }

  heading('Testing value name function');
  test(vname(null)       === 'null');
  test(vname(undefined)  === 'undefined');
  test(vname(Symbol())   === 'Symbol');
  test(vname(true)       === 'Boolean');
  test(vname(10)         === 'Number');
  test(vname(1n)         === 'BigInt');
  test(vname('')         === 'String');
  test(vname({})         === 'Object');
  test(vname([])         === 'Array');
  test(vname(()=>{})     === 'Function');
  test(vname(/ /)        === 'RegExp');
  test(vname(new Date()) === 'Date');

  heading('Testing type name function');
  test(tname(null)       === 'null');
  test(tname(undefined)  === 'undefined');
  test(tname(Symbol)     === 'Symbol');
  test(tname(Boolean)    === 'Boolean');
  test(tname(Number)     === 'Number');
  test(tname(BigInt)     === 'BigInt');
  test(tname(String)     === 'String');
  test(tname(Object)     === 'Object');
  test(tname(Array)      === 'Array');
  test(tname(Function)   === 'Function');
  test(tname(RegExp)     === 'RegExp');
  test(tname(Date)       === 'Date');

  heading('Testing value type function');
  test(vtype(null)       === null);
  test(vtype(undefined)  === undefined);
  test(vtype(Symbol())   === Symbol);
  test(vtype(true)       === Boolean);
  test(vtype(10)         === Number);
  test(vtype(1n)         === BigInt);
  test(vtype('')         === String);
  test(vtype({})         === Object);
  test(vtype([])         === Array);
  test(vtype(()=>{})     === Function);
  test(vtype(/ /)        === RegExp);
  test(vtype(new Date()) === Date);

  heading('Testing warning mode (you should see ERROR: messages and stack traces)');
  mode_warn();
  test(is(Number,5));
  test(!is(String,5));
  test(!is(Array,''));
  test(!is(Object,undefined));
  test(!is(Object,null));

  heading('Testing check mode (you should see no stack traces)');
  mode_bool();
  test(is(Number, 5));
  test(!is(String, 5));
  test(!is(Boolean, 0));
  test(!is(Boolean, ''));
  test(!is(Boolean, null));
  test(!is(Boolean, undefined));
  test(!is(null, 0));
  test(!is(null, ''));
  test(!is(null, undefined));
  test(!is(undefined, 0));
  test(!is(undefined, ''));
  test(!is(undefined, null));
  test(is(undefined, undefined));
  test(is(null, null));
  test(is(Symbol, Symbol()));
  test(is(Boolean, true));
  test(is(Boolean, false));
  test(is(Boolean, Boolean(1)));
  test(is(Boolean, new Boolean(0)));
  test(is(Number, 0));
  test(is(Number, 5));
  test(is(Number, +'5'));
  test(is(Number, Number(5)));
  test(is(Number, new Number(5)));
  test(is(Number, NaN));
  test(is(Number, Infinity));
  test(is(Number, -Infinity));
  test(is(BigInt, 100n));
  test(is(BigInt, BigInt(100)));
  test(is(String,''));
  test(is(String, String('')));
  test(is(String, new String('')));
  test(is(String, Date()));
  test(is(Array, []));
  test(is(Array, Array(5)));
  test(is(Array, new Array(5)));
  test(is(Object, {}));
  test(is(Object, Object()));
  test(is(Object, new Object()));
  test(is(Object, Object.create({})));
  test(is(RegExp, / /));
  test(is(RegExp, RegExp('')));
  test(is(RegExp, new RegExp('')));
  test(is(Date, new Date()));
  test(is(Function, ()=>{}));
  test(is(Function, Number));
  test(is(Function, Function));
  test(is(Function, function(){}));
  test(is(Function, Function()));
  test(is(Function, new Function()));

  heading('Testing fail mode (you should see one stack trace)');
  mode_fail();
  test(is(Number,5));
  console.log('\nNOTE: the next test should forcefully exit the program. If you see messages after the trace, then it failed.');
  test(!is(String,5)); 
  print_trace('the program should have exited on the last test');
  test(false);
}
