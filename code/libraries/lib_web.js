/*
## Description
Helper until the native fetch API becomes stable in Node.

## Contacts
julian.tonti-filippini@curtin.edu.au

## License
Apache 2.0
*/
const fs    = require('fs');
const fetch = require('node-fetch');

// download to a file or to stdout
async function download(url,ofile) {
  const response = await fetch(url);
  const ostream = ofile ? fs.createWriteStream(ofile) : process.stdout;
  const tstream = new WritableStream({
    write(chunk) { ostream.write(chunk); }
  });
  await new Promise((pass,fail) => {
    response.body.pipeTo(tstream);
    ostream.on("error",fail);
    ostream.on("finish",pass);
  });
}
module.exports = { download }