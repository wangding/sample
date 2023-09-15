==> 01-method-parse.js <==
#!/usr/bin/env node

const http = require('http');

http.createServer((req, res) => {
  console.log('HTTP request method:', req.method);

  switch(req.method) {
    case 'GET':
      select(req, res);
      break;

    case 'POST':
      create(req, res);
      break;

    case 'PUT':
      update(req, res);
      break;

    case 'DELETE':
      remove(req, res);
      break;

    default:
      res.end('Something Wrong!');
  }
}).listen(8080);

function select(req, res) {
  res.end(req.method);
}

function create(req, res) {
  res.end(req.method);
}

function update(req, res) {
  res.end(req.method);
}

function remove(req, res) {
  res.end(req.method);
}

==> 02-url-parse.js <==
#!/usr/bin/env node

const http = require('http'),
      log  = console.log;

print(new URL('http://wangding:123@www.baidu.com:8080/a/b/c?age=20&gender=M#/d/e/f'));

http.createServer((req, res) => {
  console.log('req URL:\t', req.url);

  print(new URL(req.url, `http://${req.headers.host}`));

  res.end('ok!');
}).listen(8080);

function print(url) {
  log('href:\t\t', url.href);
  log('protocol:\t', url.protocol);
  log('username:\t', url.username);
  log('password:\t', url.password);
  log('hostname:\t', url.hostname);
  log('port:\t\t', url.port);
  log('host:\t\t', url.host);
  log('pathname:\t', url.pathname);
  log('search:\t\t', url.search);
  log('hash:\t\t', url.hash);

  log('pathname parse:\t', url.pathname.split('/'));
  log('age:\t\t', url.searchParams.get('age'));
  log('gender:\t\t', url.searchParams.get('gender'));
  log();
}

==> 03-req-header-parse.js <==
#!/usr/bin/env node

const http = require('http'),
      log  = console.log;

http.createServer((req, res) =>{
  log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  log(req.headers);
  log('');

  log('Host:', req.headers.host);                     // 对象的方式解析请求头字段
  log('User-Agent:', req.headers['user-agent']);      // 数组的方式解析请求头字段
  log('Content-Type:', req.headers['content-type']);  // 因为变量名中间不能有横线
  log('');

  log('authorization:', req.headers.authorization);

  const auth = req.headers.authorization;

  if(typeof auth !== 'undefined') {
    const [type, user] = auth.split(' ');
    if(type === 'Basic') log('username:password:', atob(user));
  }

  res.end('OK!');
}).listen(8080);

==> 04-response.js <==
#!/usr/bin/env node

const http = require('http'),
      log  = console.log;

const html = ''
  + '<!DOCTYPE html>'
  + '<html>'
    + '<head>'
      + '<title>Hello</title>'
    + '</head>'
    + '<body>'
      + '<h1>Hello world!</h1>'
    + '</body>'
  + '</html>';

http.createServer((req, res) =>{
  log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  log(req.headers);
  log();

  if(req.url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Content-Lenght': Buffer.byteLength(html)
    });
    res.end(html);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Resource not found!');
  }
}).listen(8080);

==> 05-upload.js <==
#!/usr/bin/env node

const http = require('http'),
      log  = console.log;

http.createServer((req, res) => {
  if(req.url != '/') {
    err(res);
    return;
  }

  log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  log(req.headers);
  log('');

  if(req.method === 'POST') {
    req.pipe(process.stdout);
    res.end('OK!');
  } else {
    err(res);
  }
}).listen(8080);

function err(res) {
  const msg = 'Not found!';

  res.statusCode = 404;
  res.setHeader('Content-Length', msg.length);
  res.setHeader('Content-Type', 'text/plain');

  res.end(msg);
}

==> 06-form-get.js <==
#!/usr/bin/env node

const http = require('http'),
      log  = console.log;

let items = [];

http.createServer((req, res) => {
  let path = new URL(req.url, `http://${req.headers.host}`).pathname;

  if(path != '/') {
    err(res);
    return;
  }

  log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  log('');

  operate(req, res);
}).listen(8080);

function show(res) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Todo list</title>
    </head>
    <body>
      <h1>Todo List</h1>
      <form method="get" action="/">
        <p><input type="text" name="item" />
        <input type="submit" value="Add Item" /></p>
      </form>
      <ul>
        ${items.map(item => '<li>' + item + '</li>').join('\n')}
      </ul>
    </body>
    </html>`;

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));

  res.statusCode = 200;
  res.end(html);
}

function operate(req, res) {
  const value = new URL(req.url, `http://${req.headers.host}`).searchParams.get('item');

  if(value !== null && value !== '') items.push(value);

  log(items);
  show(res);
}

function err(res) {
  const msg = 'Not found!';

  res.statusCode = 404;
  res.setHeader('Content-Length', msg.length);
  res.setHeader('Content-Type', 'text/plain');

  res.end(msg);
}

==> 07-form-post.js <==
#!/usr/bin/env node

const http = require('http'),
      log  = console.log;

let items = [];

http.createServer((req, res) => {
  if(req.url != '/') {
    err(res);
    return;
  }

  log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  log('');

  switch(req.method) {
    case 'GET':
      show(res);
      break;

    case 'POST':
      operate(req, res);
      break;

    default:
      err(res);
      break;
  }
}).listen(8080);

function show(res) {
  let html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Todo list</title>
      </head>
      <body>
        <h1>Todo List</h1>
        <form method="post" action="/">
          <p><input type="text" name="item" />
          <input type="submit" value="Add Item" /></p>
        </form>
        <ul>
          ${items.map(item => '<li>' + item + '</li>').join('')}
        </ul>
      </body>
    </html>`;

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));

  res.statusCode = 200;
  res.end(html);
}

function operate(req, res) {
  let data = '';

  req.on('data', chunk => data += chunk);
  req.on('end', () => {
    log(data);

    const item = new URLSearchParams(data).get('item');
    if(item !== '' && item !== null) items.push(item);

    show(res);
  });
}

function err(res) {
  const msg = 'Not found!';

  res.statusCode = 404;
  res.setHeader('Content-Length', msg.length);
  res.setHeader('Content-Type', 'text/plain');

  res.end(msg);
}

==> 08-form-cmd.js <==
#!/usr/bin/env node

const http = require('http'),
      log  = console.log,
      {exec} = require('child_process');

http.createServer((req, res) => {
  if(req.url != '/') {
    err(res);
    return;
  }

  log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  log('');

  switch(req.method) {
    case 'GET':
      show(res, '');
      break;

    case 'POST':
      execCmd(req, res);
      break;

    default:
      err(res);
      break;
  }
}).listen(8080);

function err(res) {
  const msg = 'Not found';

  res.statusCode = 404;
  res.setHeader('Content-Length', msg.length);
  res.setHeader('Content-Type', 'text/plain');

  res.end(msg);
}

function show(res, result) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>execute linux command</title>
      </head>
      <body>
        <h1>Input a Linux Command</h1>
        <form method="post" action="/">
            <p><input type="text" name="cmd" />
            <input type="submit" value="execute" /></p>
        </form>
        <div><pre style="font-family: Consolas;">${result}</pre></div>
      </body>
    </html>`;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));

  res.end(html);
}

function execCmd(req, res) {
  let cmd = '', result = '';

  req.on('data', chunk => cmd += chunk);
  req.on('end', () => {
    cmd = new URLSearchParams(cmd).get('cmd');

    if(cmd === '') {
      result = 'Please input linux command!';
      show(res, result);
    } else {
      console.log(cmd);
      exec(cmd, (err, out, stderr) => {
        result = (err === null) ? out : stderr;
        show(res, result);
      });
    }
  });
}

==> 09-upload-file.js <==
#!/usr/bin/env node

const http = require('http'),
      fs   = require('fs'),
      qs   = require('querystring'),
      log  = require('util').debuglog('UPLOAD-FILE');

const uploadPage = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Upload File</title>
    </head>
    <body>
      <h1>Upload File</h1>
      <form method="post" enctype="multipart/form-data" action="/upload">
        <input type="file" name="upload">
        <input type="submit" value="Upload">
      </form>
    </body>
  </html>`;

const okPage = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Upload File</title>
    </head>
    <body>
      <h1>Upload File OK!</h1>
      <a href="/">continue to upload</a>
    </body>
  </html>`;

let errorPage = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Error</title>
    </head>
    <body>
      <h1>Sorry! There is  nothing!</h1>
      <a href="/">back to upload file</a>
    </body>
  </html>`;

http.createServer((req, res) => {
  log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  log(req.headers);
  log('');

  if(req.method === 'POST') {
    if(req.url !== '/upload') {
      show(res, errorPage);
      return;
    }

    req.setEncoding('binary');
    let file;
    req.on('data', (data)=>{
      file += data;
    });

    req.on('end', ()=>{
      let data = file.split('\r\n');
      log(data);
      let buf = data[4];
      let files = data[1].split(';');
      let fileName = qs.parse(files[2].trim())['filename'];
      fileName = fileName.slice(1, fileName.length-1);
      fs.writeFileSync(fileName, buf, {'encoding': 'binary'});
    });

    show(res, okPage);
  } else {
    if(req.url === '/') {
      show(res, uploadPage);
    } else {
      show(res, errorPage);
    }
  }
}).listen(8080);

function show(res, page) {
  res.statusCode = 404;
  res.setHeader('Content-Length', page.length);
  res.setHeader('Content-Type', 'text/html');

  res.end(page);
}

==> 10-upload-pic.js <==
#!/usr/bin/env node

const http = require('http'),
      fs   = require('fs'),
      qs   = require('querystring'),
      path = require('path'),
      log  = console.log;

const errorPage = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Error</title>
    </head>
    <body>
      <h1>Sorry! There is  nothing!</h1>
      <a href="/">back to upload file</a>
    </body>
  </html>`;

http.createServer((req, res) => {
  printRequest(req);

  if(req.method === 'GET' && req.url === '/') { // 请求网站首页
    show(res, uploadPage());
    return;
  }

  if(req.method === 'GET' && req.url.split('/')[1] === 'images') { // 请求图片
    sendPic(req, res);
    return;
  }

  if(req.method === 'POST' && req.url ==='/upload') { // 上传图片
    req.setEncoding('binary');
    let file;

    req.on('data', (data) => file += data);
    req.on('end', () => {
      if(writePic(file)) {
        show(res, uploadPage());
      } else {
        show(res, errorPage);
      }
    });

    return;
  }

  show(res, errorPage); // 其他请求
}).listen(8080);

function sendPic(req, res) {
  let info = req.url.split('/'),
      pic  = path.join(__dirname, req.url),
      ext = info[2].split('.')[1];

  if(info.length !== 3 || !fs.existsSync(pic)) {
    show(res, errorPage);
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'image/' + ext);
  res.setHeader('Content-length', fs.statSync(pic).size);
  res.end(fs.readFileSync(pic));
}

function printRequest(req) {
  log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  log(req.headers);
  log('');
}

function writePic(file) {
  let data = file.split('\r\n');
  let fileName = qs.parse(data[1].split(';')[2].trim())['filename'],
      start = data[0].length + data[1].length + data[2].length + data[3].length + 8,
      end   = file.indexOf('------WebKitFormBoundary', start),
      buf   = file.slice(start, end);

  fileName = fileName.slice(1, fileName.length-1);

  if(fileName === '') return false;

  fileName = path.join(__dirname, 'images', fileName);
  fs.writeFileSync(fileName, buf, {'encoding': 'binary'});

  return true;
}

function show(res, page) {
  res.statusCode = 404;
  res.setHeader('Content-Length', page.length);
  res.setHeader('Content-Type', 'text/html');

  res.end(page);
}

function uploadPage() {
  let images = fs.readdirSync('./images');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Upload Picture</title>
      </head>
      <body>
        <h1>Upload Picture</h1>
        <form method="post" enctype="multipart/form-data" action="/upload">
          <input type="file" name="upload" accept=".png, .jpg, .jpeg, .gif, .bmp">
          <input type="submit" value="Upload">
        </form>
        <div id="album">
          ${images.map(pic => '<img src="/images/' + pic + '">').join('\n')}
        </div>
      </body>
    </html>`;
}

==> 11-form-html.js <==
#!/usr/bin/env node

const http = require('http'),
      fs   = require('fs'),
      log  = console.log,
      qs   = require('querystring');

let items = [];

http.createServer((req, res) => {
  if(req.url != '/') { return err(res); }

  log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  log(req.headers);
  log('');

  switch(req.method) {
    case 'GET':
      show(res);
      break;

    case 'POST':
      add(req, res);
      break;

    default:
      err(res);
      break;
  }
}).listen(8080);

function err(res) {
  let msg = 'Not found';
  res.writeHead(404, {
    'Content-Length': msg.length,
    'Content-Type': 'text/plain'
  });
  res.end(msg);
}

function show(res) {
  let html = fs.readFileSync('./11-template.html').toString('utf8'),
      items_html = items.map(item => '<li>' + item + '</li>').join('\n');

  html = html.replace('%', items_html); 
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': Buffer.byteLength(html),
    'Access-Control-Allow-Origin': '*'
  });

  res.end(html);
}

function add(req, res) {
  let body = '';

  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    let item = qs.parse(body).item;
    if(item !== '') {  items.push(item);  }

    show(res);
  });
}

==> 12-rest-api.js <==
#!/usr/bin/env node

const http = require('http'),
      fs   = require('fs');

let items = [];

http.createServer((req, res) => {
  printRequest(req);

  if(req.url === '/' && req.method === 'GET') {
    showHomePage(res);
    return;
  }

  if(req.url === '/12-todo.js' && req.method === 'GET') {
    sendFile(res);
    return;
  }

  if(req.url !== '/todo' && !/^\/todo:(\d)+$/.test(req.url)) {
    showErrPage(res);
    return;
  }

  switch(req.method) {
    case 'GET':
      select(res);
      break;

    case 'POST':
      insert(req, res);
      break;

    case 'DELETE':
      del(req, res);
      break;

    case 'PUT':
      update(req, res);
      break;

    default:
      break;
  }
}).listen(8080);

function showHomePage(res) {
  const html = fs.readFileSync('./12-todo.html').toString('utf8');

  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': Buffer.byteLength(html),
    'Cache-Control': 'public,max-age=600',
    'Access-Control-Allow-Origin': '*'
  });

  res.end(html);
}

function showErrPage(res) {
  const html = fs.readFileSync('./12-404.html').toString('utf8');

  res.writeHead(404, {
    'Content-Type': 'text/html',
    'Cache-Control': 'public,max-age=600',
    'Content-Length': Buffer.byteLength(html),
  });

  res.end(html);
}

function sendFile(res) {
  const data = fs.readFileSync('./12-todo.js').toString('utf8');

  res.writeHead(200, {
    'Content-Type': 'application/javascript',
    'Cache-Control': 'public,max-age=600',
    'Content-Length': Buffer.byteLength(data),
  });

  res.end(data);
}

function printRequest(req) {
  const log = console.log;

  log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  log('');
  log(items);
}

// method: GET, url: /todo, fun: get all todo items
function select(res) {
  const body = JSON.stringify(items);

  res.writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain; charset="utf-8"',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(body);
}

// method: POST, url: /todo, fun: insert todo item
function insert(req, res) {
  let item = '';

  req.on('data', data => item += data);
  req.on('end', () => {
    items.push(item);
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end('Insert OK!');
  });
}

// method: DELETE, url: /todo,  fun: del all todo items
// method: DELETE, url: /todo:id, fun: del todo item by id 
function del(req, res) {
  if(req.url === '/todo') {  // del all
    items = [];
    res.end('Delete OK!');
    return;
  }

  const arg = req.url.split(':'),
        id  = parseInt(arg[1]);

  res.setHeader('Access-Control-Allow-Origin', '*');

  if(!items[id]) {
    res.statusCode = 404;
    res.end('Not found');
  } else {
    items.splice(id, 1);
    res.statusCode = 200;
    res.end('Delete OK');
  }
}

// method: PUT, url: /todo:id, fun: update todo item by id
function update(req, res) {
  const arg = req.url.split(':'),
        id  = parseInt(arg[1]);

  let item = '';

  res.setHeader('Access-Control-Allow-Origin', '*');
  req.on('data', chunk => item += chunk);
  req.on('end', () => {
    if(!items[id]) {
      res.statusCode = 404;
      res.end('Not found');
    } else {
      items[id] = item;
      res.statusCode = 200;
      res.end('Update OK');
    }
  });
}

==> 12-todo.js <==
/* global location, document: true */
const q = document.querySelector,
      $ = q.bind(document);

const $todo      = $('#todo'),
      $btnAdd    = $('#btnAdd'),
      $btnDelAll = $('#btnDelAll'),
      $out       = $('#output');

let items = [];
const baseURL = location.origin + '/todo';

getItems();

function onEdtClick(e) {
  const $li  = e.target.parentNode,
        src  = $li.textContent,
        id   = items.indexOf(src),
        dom  = '<div><input class="todo-edit" type="text"><input class="btn-save" type="button" value="save"><div>';

  $li.innerHTML = dom;

  const $edt = $li.querySelector('.todo-edit'),
        $sav = $li.querySelector('.btn-save');

  $edt.value = src;
  $sav.onclick = () => {
    const dst = $edt.value;
    if(dst === '') return;

    $li.innerHTML = dst + '<i class="iconfont iconbianji"></i><i class="iconfont iconlajitong"></i></li>';

    $li.querySelector('.iconlajitong').onclick = onDelClick;
    $li.querySelector('.iconbianji').onclick = onEdtClick;

    fetch(baseURL + ':' + id, {method: 'PUT', body: dst});
    items[id] = dst;
  };

  $edt.focus();
  $edt.select();
}

function onDelClick(e) {
  const id = items.indexOf(e.target.parentNode.textContent);

  fetch(baseURL + ':' + id, {method: 'DELETE'});
  items.splice(id, 1);

  showData();
}

$btnAdd.onclick = () => {
  if($todo.value === '') return;

  fetch(baseURL, {method: 'POST', body: $todo.value});
  items.push($todo.value);

  $todo.value = '';
  showData();
};

$btnDelAll.onclick = () => {
  items = [];
  fetch(baseURL, {method: 'DELETE'});
  showData();
};

function getItems() {
  fetch(baseURL)
    .then(res => res.json())
    .then(json => {
      items = json;
      showData();
    });
}

function showData() {
  const dom = items.map(item => '<li>' + item + '<i class="iconfont iconbianji"></i><i class="iconfont iconlajitong"></i></li>').join('\n');
  $out.innerHTML = `<ul>${dom}</ul>`;
  $out.querySelectorAll('.iconlajitong').forEach(item => item.onclick = onDelClick);
  $out.querySelectorAll('.iconbianji').forEach(item => item.onclick = onEdtClick);
}
