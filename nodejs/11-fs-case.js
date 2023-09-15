==> 25-read-cfg.js <==
#!/usr/bin/env node

const fs  = require('fs'),
      log = console.log;

let cfg = fs.readFileSync('../package.json', 'utf8');
cfg = JSON.parse(cfg);

log(`name: ${cfg.name}`);
log(`version: ${cfg.version}`);
log(`description: ${cfg.description}`);

==> 26-web-log.js <==
#!/usr/bin/env node

const fs   = require('fs'),
      http = require('http');

function log(req) {
  const now  = new Date(Date.now()),
        file = `/home/wangding/logs/${now.toISOString().substring(0,10)}.log`,
        line = `${now.toLocaleString()}\t${req.method}\t${req.url}\tHTTP/${req.httpVersion}\n`
             + `${now.toLocaleString()}\t${JSON.stringify(req.headers)}\n`;
  fs.appendFileSync(file, line);
}

http.createServer((req, res) => {
  log(req);
  res.end('hello');
}).listen(8080);

==> 27-passwd.js <==
#!/usr/bin/env node

const fs  = require('fs');

const data = [];
let lines = fs.readFileSync('/etc/passwd', 'utf8');
lines = lines.split('\n');
lines.forEach(line => {
  const arr = line.split(':');
  const obj = {
    user_name: arr[0],
    user_id: arr[2],
    group_id: arr[3],
    home_dir: arr[5],
    login_shell: arr[6],
  };
  data.push(obj);
});

console.table(data);
#!/usr/bin/env node

const fs  = require('fs');

function line2obj(line) {
  const arr = line.split(':');
  return {
    user_name: arr[0],
    user_id: arr[2],
    group_id: arr[3],
    home_dir: arr[5],
    login_shell: arr[6],
  };
}

let lines = fs.readFileSync('/etc/passwd', 'utf8');
lines = lines.split('\n');

console.table(lines.map(line2obj));
