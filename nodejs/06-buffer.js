==> 01-basic.js <==
#!/usr/bin/env node

const log = console.log;

let buf1 = Buffer.alloc(256);
buf1[0]  = 0;

log('buf1 length:', buf1.length);
log('\nbuf1:', buf1);

// 通过循环，来初始化 buffer 中的每个字节
for(let i=0; i<buf1.length; i++) buf1[i] = i;
log('\nbuf1:', buf1);

// 类似数组，对 buffer 做切片操作
let buf2 = buf1.slice(250, 256);
log('\nbuf2:', buf2);

// 在 buffer 中填充数据，buffer 数据转化成 JSON 数据
buf2.fill(0);
log('\nbuf2:', buf2);
log('\nbuf2\'s JSON:', buf2.toJSON());
log('\nbuf2\'s JSON:', JSON.stringify(buf2));

// 用数组初始化 buffer
let array = ['a', 0xba, 0xdf, 0x00, 255, 10];
let buf3  = Buffer.from(array);

log('\nbuf3:', buf3.length, buf3);

// 用字符串初始化 buffer
let buf4 = Buffer.from('hello world', 'utf8');
log('\nbuf4:', buf4.length, buf4);

// buffer 数据复制
buf4.copy(buf3, 0, 0, buf3.length);
log('\nbuf3:', buf3.length, buf3);

// UTF8 编码
let str = '你好 wangding';
let buf5 = Buffer.from(str, 'utf8');
log('\nbuffer length:', buf5.length);
log('buffer content:', buf5);
log('string length:', str.length);

==> 02-encode.js <==
#!/usr/bin/env node

const log = console.log,
      usr = process.argv[2],
      pwd = process.argv[3];

if(process.argv.length !== 4) {
  console.error('usage：cmd username password');
  process.exit(1);
}

log('user name: %s\npassword: %s', usr, pwd);

// method A
log('Base64:', btoa(usr + ':' + pwd));

// method B
const buf = Buffer.from(usr + ':' + pwd);
log('Base64:', buf.toString('Base64'));

==> 03-decode.js <==
#!/usr/bin/env node

if(process.argv.length !== 3) {
  console.error('usage：cmd base64_string');
  process.exit(1);
}

// method A
const buf = atob(process.argv[2]);
const info = buf.split(':');

// method B
/*
const buf = Buffer.from(process.argv[2], 'base64');
const info = buf.toString('utf8').split(':');
*/

if(info.length !== 2) {
  console.error('信息有误！');
  process.exit(2);
}

console.log('user name: %s\npassword: %s', info[0], info[1]);

==> 04-data-uri.js <==
#!/usr/bin/env node

const fs   = require('fs'),
      http = require('http'),
      path = require('path'),
      file = process.argv[2];

if(process.argv.length !== 3) {
  console.error('命令行参数格式：cmd fileName');
  process.exit(1);
}

try {
  var data = fs.readFileSync(file).toString('base64');
} catch(e) {
  console.error(e.message);
  process.exit(2);
}

let ext  = path.extname(file);
let uriData = 'data:image/' + ext.slice(1, ext.length) + ';base64,' + data;

//console.log('data uri:\n%s', uriData);

let html = `
  <!DOCTYPE html>
  <html>
    <head><title>base64 demo</title></head>
    <body>
      <img alt="${path.basename(file, ext)}" src="${uriData}">
    </body>
  </html>`;

http.createServer((req, res) => {
  console.log(req.headers);
  console.log(req.url + '\n');
  res.end(html);
}).listen(8080);

==> 05-bmp-info.js <==
#!/usr/bin/env node

const fs   = require('fs'),
      file = process.argv[2],
      log  = console.log;

if(process.argv.length !== 3) {
  console.error('命令行参数格式：cmd fileName');
  process.exit(1);
}

let buf;

try {
  buf = fs.readFileSync(file);
} catch(e) {
  console.error(e.message);
  process.exit(2);
}

if(buf.toString('ascii', 0, 2) === 'BM') {
  log('width:', buf.readInt32LE(0x12));
  log('height:', buf.readInt32LE(0x16));
  log('color depth:', buf.readUInt16LE(0x1c));
}

==> 06-bmp-write.js <==
#!/usr/bin/env node

const fs = require('fs');

const width  = 16,
      height = 16;

let pixelByteSize = width * height * 4;
let totalSize     = pixelByteSize + 54;

let buf = Buffer.alloc(totalSize);

buf.fill(0);

// head
buf.write('BM');
buf.writeUInt32LE(totalSize, 0x02);
buf.writeUInt32LE(54, 0x0a);
buf.writeUInt32LE(40, 0x0e);
buf.writeUInt16LE(1, 0x1a);
buf.writeUInt16LE(32, 0x1c);
buf.writeUInt32LE(pixelByteSize, 0x22);
buf.writeInt32LE(width, 0x12);
buf.writeInt32LE(height, 0x16);

// data
for(let i=54; i<totalSize; i+=4) {
  buf.writeUInt32LE(0xff0000ff, i);
}

fs.writeFile('./out.bmp', buf, (err) => {
  if(err != null) {
    console.error(err);
    process.exit(1);
  }
});
