==> 01-static-http-server.js <==
#!/usr/bin/env node

const http = require('http'),
      fs   = require('fs');

let buf = {};

http.createServer((req, res) => {
  sendFile(req, res);
}).listen(8080);

function sendFile(req, res) {
  let file = __dirname + req.url;

  if(!buf[file]) {
    if(!fs.existsSync(file)) {
      res.statusCode = 404;
      res.end(`${file} not exist!`);
      
      return;
    }

    console.log('Disk IO:', file);
    buf[file] = fs.readFileSync(file);   
  }

  res.end(buf[file]);
  //console.log('\n', buf, '\n');
}

==> 02-rest-api.js <==
#!/usr/bin/env node

let http = require('http'),
    fs = require('fs'),
    items = loadData();

http.createServer((req, res) => {
  console.log(req.headers);
  console.log('');

  switch(req.method) {
    case 'GET':
      get(res);
      break;

    case 'POST':
      insert(req, res);
      break;

    case 'DELETE':
      del(req, res);
      break;

    case 'PUT':
      change(req, res);
      break;

    default:
      break;
  }
}).listen(8080);

function get(res) {
  let body = JSON.stringify(items);

  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(body);
}

function insert(req, res) {
  let item = '';

  req.on('data', (data) => { item += data; });
  req.on('end', () => {
    items.push(item);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end('Insert OK!');
  });
}

function del(req, res) {
  let arg = req.url.split('/');
  if(arg[1] === '') {
    items = [];
  }

  let i = parseInt(arg[1]);

  res.setHeader('Access-Control-Allow-Origin', '*');

  if(!items[i]) {
    res.statusCode = 404;
    res.end('Not found');
  } else {
    items.splice(i, 1);
    res.end('Delete OK');
  }
}

function change(req, res) {
  let arg = req.url.split('/');
  if(arg[1] === '') {
    items = [];
  }

  let item = '';
  res.setHeader('Access-Control-Allow-Origin', '*');
  req.on('data', (chunk) => { item += chunk; });
  req.on('end', () => {
    let i = parseInt(arg[1]);

    if(!items[i]) {
      res.statusCode = 404;
      res.end('Not found');
    } else {
      items[i] = item;
      res.end('Change OK');
    }
  });
}

function loadData() {
  try {
    let data = fs.readFileSync('./data.txt', 'utf8');
    console.log(data);
    return JSON.parse(data);
  } catch(e) { return []; }
}

process.on('SIGINT', () => {
  fs.writeFileSync('./data.txt', JSON.stringify(items));
  process.exit();
});

==> 03-mysql.js <==
#!/usr/bin/env node

const mysql = require('mysql2/promise'),
      log   = console.table;

let db = {};

db.insert = async(con, areaName) => {
  const sql = `insert into areas(area_name) values('${areaName}')`;

  const [res] = await con.query(sql);
  log(res);
};

db.update = async(con, id, areaName) => {
  const sql = `update areas set area_name = '${areaName}' where id = ${id}`;

  const [res] = await con.query(sql);
  log(res);
};

db.del = async(con, id) => {
  const sql = `delete from areas where id = ${id}`;

  const [res] = await con.query(sql);
  log(res);
};

db.select = async(con) => {
  const sql = 'select * from areas order by id';

  const [rows] = await con.query(sql);
  log(rows);
};

async function main() {
  const con = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ddd',
    database: 'demo'
  });

  await db[process.argv[2]](con, process.argv[3], process.argv[4]);
  await con.end();
}

main();
