#!/usr/bin/env node

const zlib = require('zlib'),
      fs   = require('fs'),
      src  = process.argv[2];

if(process.argv.length !== 3) {
  console.error('命令行参数错误！');
  process.exit(1);
}

if(!fs.existsSync(src)) {
  console.error('%s not exist!', src);
  process.exit(2);
}

const dst = src + '.gz';

//fs.createReadStream(src).pipe(zlib.createGzip()).pipe(fs.createWriteStream(dst));

var buf = fs.readFileSync(src);

zlib.gzip(buf, (err, data) => {
  console.log('%s size: %d byte', src, buf.length);
  console.log('%s size: %d byte', dst, data.length);
  fs.writeFileSync(dst, data);
});
#!/usr/bin/env node

const zlib = require('zlib'),
      fs   = require('fs'),
      src  = process.argv[2];

if(process.argv.length !== 3) {
  console.error('命令行参数错误！');
  process.exit(1);
}

if(!fs.existsSync(src)) {
  console.error('%s not exist!', src);
  process.exit(2);
}

const dst = src.slice(0, src.length - 3);

fs.createReadStream(src).pipe(zlib.createGunzip()).pipe(fs.createWriteStream(dst));
#!/usr/bin/env node

const http = require('http'),
      fs   = require('fs'),
      zlib = require('zlib'),
      path = require('path');

var www = process.argv[2] || 'www';

var root = path.isAbsolute(www) ? www : path.join(__dirname, www);

console.log('root:', root);

http.createServer((req, res) => {
  console.log(req.headers);
  console.log('');

  var file = root + req.url;
  if(fs.existsSync(file)) {
    res.setHeader('Content-Encoding', 'gzip');
    fs.createReadStream(file).pipe(zlib.createGzip()).pipe(res);
  } else {
    res.statusCode = 404;
    res.end(file + ' NOT FOUND!');
  }
}).listen(8080);
