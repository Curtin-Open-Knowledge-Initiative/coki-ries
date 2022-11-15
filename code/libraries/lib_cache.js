/*
## Description
Simple file cache

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const file  = require('./lib_file');
const hash  = require('./lib_hash');
const TEMP  = require('os').tmpdir();
const cache = {
  home     : TEMP,
  set_home : (path)    => cache.home = file.resolve(path || TEMP),
  path     : (key)     => file.resolve(cache.home, key),
  hash     : (str)     => 'hash_' + hash.text(str), 
  exists   : (key)     => file.exists(cache.path(key)),
  load     : (key)     => file.load(cache.path(key)),
  save     : (key,txt) => file.save(cache.path(key), txt),
  remove   : (key)     => file.remove(cache.path(key)),
  reserve  : (key)     => file.mkdir(cache.path(key)),
  download : (key,url) => new Promise((pass,fail) => {
    cache.exists(key) ? pass(cache.load(key)) : fetch(url)
    .then (res => res.text())
    .then (txt => { cache.save(key,txt); pass(txt); })
    .catch(err => { console.error(err) ; fail(err); });
  }),
};
module.exports = cache;

// test
if (require.main === module) {
  const assert = require('assert');
  async function test() {
    const url1 = 'https://www.google.com/index.html';
    const url2 = 'https://www.google.com/index.html.test';
    const key1 = cache.hash(url1);
    const key2 = cache.hash(url2);
    
    cache.remove(key1);
    cache.remove(key2);
    assert(cache.exists(key1) === false);
    assert(cache.exists(key2) === false);
    
    await cache.download(key1,url1);
    assert(cache.exists(key1) === true);
    
    let text = cache.load(key1);
    assert(text != '');

    cache.save(key2, text);
    assert(cache.exists(key2));
    assert(cache.load(key1) === cache.load(key2));

    cache.remove(key1);
    cache.remove(key2);
    assert(cache.exists(key1) === false);
    assert(cache.exists(key2) === false);

    console.log('tests passed');
  }
  test();
}