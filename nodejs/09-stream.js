==> 01-std-io.js <==
#!/usr/bin/env node

const stdin  = process.stdin,
      stdout = process.stdout;

stdin.setEncoding('utf8');

stdin.on('data', (data) => {
  stdout.write(data.toUpperCase());
});

stdin.push('hello world!\n');
//stdin.push(null);

//stdin.pipe(stdout);

for(let c='a'.charCodeAt(0); c<='z'.charCodeAt(0); c++) {
  stdout.write(String.fromCharCode(c));
}

stdout.write('\n');

==> 02-static-web-server.js <==
#!/usr/bin/env node

const http = require('http'),
      log  = console.log,
      fs   = require('fs');

http.createServer((req, res) => {
  log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  log(req.headers);
  log('');

  let file = __dirname + req.url;
  fs.readFile(file, (err, data) => {
    if(err) {
      log(err.message);
      res.statusCode = 404;
      res.end(err.message);
    } else {
      res.end(data);
    }
  });
}).listen(8080);

==> 03-make-big-file.js <==
#!/usr/bin/env node

const fs   = require('fs'),
      file = fs.createWriteStream('./big.file');

for(let i=0; i<= 1e6; i++) {
  file.write('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n');
}

file.end();

==> 03-static-web-server-stream.js <==
#!/usr/bin/env node

const http = require('http'),
      log  = console.log,
      fs   = require('fs');

http.createServer((req, res) => {
  log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  log(req.headers);
  log('');

  let file = __dirname + req.url;

  // 错误处理方式一：主动防御
  if(fs.existsSync(file)) {
    fs.createReadStream(file).pipe(res);
  } else {
    res.statusCode = 404;
    res.end(req.url + ' not exist!');
  }

  /* 错误处理方式二：error 事件捕获
  let s = fs.createReadStream(file);
  s.on('error', (err) => {
    console.log(err.message);
    res.statusCode = 404;
    res.end(err.message);
  });
  s.pipe(res);
  */
}).listen(8080);

==> 04-readable-push.js <==
#!/usr/bin/env node

const { Readable } = require('stream');

let rs = new Readable();

rs.push('hello ');
rs.push('stream!\n');
rs.push(null);

rs.pipe(process.stdout);

==> 05-readable-pull.js <==
#!/usr/bin/env node

const { Readable } = require('stream');

let rs = new Readable(),
    c  = 'a'.charCodeAt(0);

rs._read = () => {
  rs.push(String.fromCharCode(c++));
  if(c>'z'.charCodeAt(0)) rs.push(null);
};

rs.pipe(process.stdout);

==> 06-my-readable.js <==
#!/usr/bin/env node

const { Readable } = require('stream');

class MyReadable extends Readable {
  constructor() {
    super();
  }

  _read() {
    this.push(String.fromCharCode(this.#c++));
    if (this.#c>'z'.charCodeAt(0)) this.push(null);
  }

  #c = 'a'.charCodeAt(0);
}

const rs = new MyReadable();
rs.pipe(process.stdout);

==> 07-green-stream.js <==
#!/usr/bin/env node

const { Writable } = require('stream'),
      chalk = require('chalk');

class GreenStream extends Writable {
  constructor() {
    super();
  }

  _write(chunk, encoding, callback) {
    process.stdout.write(chalk.greenBright(chunk));
    callback();
  }
}

process.stdin.pipe(new GreenStream());

==> 08-transform.js <==
#!/usr/bin/env node

const stdin  = process.stdin,
      stdout = process.stdout,
      { Transform } = require('stream');

stdin.setEncoding('utf8');

let tf = new Transform();

tf._transform = function(chunk, encoding, callback) {
  this.push(Buffer.from(chunk.toString('utf8').toUpperCase()));
  callback();
};

stdin.pipe(tf).pipe(stdout);

==> 09-my-transform.js <==
#!/usr/bin/env node

const stdin  = process.stdin,
      stdout = process.stdout,
      { Transform }  = require('stream'),
      chalk  = require('chalk');

stdin.setEncoding('utf8');

class MyTransform extends Transform {
  constructor() {
    super();
  }

  _transform(chunk, encoding, callback) {
    this.push(chalk.greenBright(chunk.toString('utf8')));
    callback();
  }
}

let tf = new MyTransform();

stdin.pipe(tf).pipe(stdout);

==> 10-rgb.js <==
#!/usr/bin/env node

const { Readable } = require('stream');

class RGB extends Readable {
  constructor(num) {
    super();
    this.#num = num;
  }

  _read() {
    this.#pos++ > this.#num ? this.push(null) : this.push(this.#rgb());
  }

  #rgb() {
    let x = Math.round(Math.random()*100);
    return x <= 60 ? 'R' : ( x <= 75 ? 'G':'B');
  }

  #num = 0;
  #pos = 0;
}

const rs = new RGB(100);
rs.pipe(process.stdout);
