==> 01-my-cat-async.js <==
#!/usr/bin/env node

const fs   = require('fs'),
      file = process.argv[2] || __filename;

fs.readFile(file, (err, buf) => {
  if(err) {
    console.error(err.message);
    process.exit(1);
  } else {
    console.log(buf.toString('utf8'));
  }
});

==> 02-my-cat-lower.js <==
#!/usr/bin/env node

const fs   = require('fs'),
      file = process.argv[2] || __filename;

try {
  let len = fs.statSync(file).size,
      buf = Buffer.alloc(len),
      fid = fs.openSync(file, 'r');

  fs.readSync(fid, buf, 0, len, 0);
  console.log(buf.toString('utf8'));
} catch(e) {
  console.error(e.message);
  process.exit(1);
}

==> 02-my-cat-promise.js <==
#!/usr/bin/env node

import { readFile } from 'fs/promises';

const file = process.argv[2];

async function main() {
  try {
    const content = await readFile(file, 'utf8');
    console.log(content);
  } catch(e) {
    console.error(e.message);
  }
}

main();

==> 03-my-cat-mix.js <==
#!/usr/bin/env node

const fs   = require('fs'),
      file = process.argv[2] || __filename;

try {
  const fid = fs.openSync(file, 'r');
  fs.writeSync(1, fs.readFileSync(fid).toString('utf8'));
  fs.closeSync(fid);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

==> 04-my-cat-stream.js <==
#!/usr/bin/env node

const fs   = require('fs'),
      err  = console.error,
      file = process.argv[2] || __filename;

if(!fs.existsSync(file)) {
  err('%s not exist!', file);
  process.exit(1);
}
  
if(!fs.statSync(file).isFile()) {
  err('%s is not file!', file);
  process.exit(2);
}

fs.createReadStream(file).pipe(process.stdout);

==> 05-my-cat-sync.js <==
#!/usr/bin/env node

const fs   = require('fs'),
      file = process.argv[2] || __filename;

try{
  console.log(fs.readFileSync(file).toString('utf8'));
} catch(err) {
  console.error(err.message);
  process.exit(1);
}

==> 06-my-cp.js <==
#!/usr/bin/env node

const fs  = require('fs'),
      err = console.error,
      src = process.argv[2],
      dst = process.argv[3];

if(!fs.existsSync(src)) {
  err('%s not exist!', src);
  process.exit(1);
}
  
if(!fs.statSync(src).isFile()) {
  err('%s is not file!', src);
  process.exit(2);
}

if(typeof dst === 'undefined') {
  err('dst is undefined');
  process.exit(3);
}

// 复制文件内容
let stm = fs.createReadStream(src).pipe(fs.createWriteStream(dst));

// 复制文件权限
stm.on('close', () => {
  fs.chmodSync(dst, fs.statSync(src).mode);
});

==> 07-my-mv.js <==
#!/usr/bin/env node

const fs  = require('fs'),
      src = process.argv[2],
      dst = process.argv[3];

try {
  fs.renameSync(src, dst);
} catch(err) {
  console.error(err.message);
  process.exit(1);
}

==> 08-my-rm.js <==
#!/usr/bin/env node

const fs  = require('fs'),
      err = console.error,
      src = process.argv[2];

if(!fs.existsSync(src)) {
  err('%s not exist!', src);
  process.exit(1);
}

if(!fs.statSync(src).isFile()) {
  err('%s is not file!', src);
  process.exit(2);
}

fs.unlinkSync(src);

==> 09-my-touch.js <==
#!/usr/bin/env node

const fs   = require('fs'),
      file = process.argv[2];

try {
  fs.writeFileSync(file, '');
} catch(e) {
  console.error(e.message);
  process.exit(1);
}

==> 10-my-ls.js <==
#!/usr/bin/env node

const fs  = require('fs'),
      dir = process.argv[2] || __dirname;

try {
  console.log(fs.readdirSync(dir));
} catch(err) {
  console.error(err.message);
  process.exit(1);
}

==> 11-my-mkdir.js <==
#!/usr/bin/env node

const fs  = require('fs'),
      dir = process.argv[2];

if(typeof(dir) === 'undefined') {
  console.error('没有指定要创建的目录名称！');
  process.exit(1);
}

fs.mkdirSync(dir);

==> 12-my-rm-dir.js <==
#!/usr/bin/env node

const fs  = require('fs'),
      err = console.error,
      dir = process.argv[2];

try {
  fs.rmdirSync(dir);
} catch(e) {
  err(e.message);
  process.exit(1);
}

==> 13-my-ln.js <==
#!/usr/bin/env node

const fs  = require('fs'),
      err = console.error;

let opt = {
  '4': createhardLink,
  '5': createSoftLink
};

function createSoftLink() {
  let opt = process.argv[2],
      src = process.argv[3],
      lnk = process.argv[4];

  if(opt === '-s') {
    try {
      fs.symlinkSync(src, lnk);
    } catch(e) {
      err(e.message);
      process.exit(2);
    }
  } else {
    err('命令行参数不正确！');
  }
}

function createhardLink() {
  let src = process.argv[2],
      lnk = process.argv[3];

  try {
    fs.linkSync(src, lnk);
  } catch(e) {
    err(e.message);
    process.exit(1);
  }
}

try {
  opt[process.argv.length]();
} catch(e) {
  err('命令行参数不正确！');
  process.exit(3);
}

==> 14-read-lnk.js <==
#!/usr/bin/env node

const fs  = require('fs'),
      err = console.error,
      src = process.argv[2];

if(typeof(src) === 'undefined' || process.argv.length !== 3) {
  err('命令行参数不正确!');
  process.exit(1);
}

try{
  console.log(src, '->', fs.readlinkSync(src));
} catch(err) {
  err(err.message);
  process.exit(2);
}

==> 15-my-chmod.js <==
#!/usr/bin/env node

const fs  = require('fs'),
      err = console.error,
      mod = process.argv[2],
      src = process.argv[3];

if(process.argv.length != 4) {
  err('命令行参数不正确！');
  process.exit(1);
}

try{
  fs.chmodSync(src, mod);
} catch(e) {
  err(e.message);
  process.exit(2);
}

==> 16-my-chown.js <==
#!/usr/bin/env node

const fs   = require('fs'),
      err  = console.error,
      uid  = process.argv[2],
      gid  = process.argv[3],
      file = process.argv[4];

if(process.argv.length !== 5) {
  err('命令行参数不正确！');
  process.exit(1);
}

try{
  fs.chownSync(file, Number(uid), Number(gid));
} catch(e) {
  err(e.message);
  process.exit(2);
}

==> 17-my-stat.js <==
#!/usr/bin/env node

const fs  = require('fs'),
      src = process.argv[2] || __filename;

try{
  console.log(fs.statSync(src));
} catch(e) {
  console.error(e.message);
  process.exit(1);
}

==> 18-watch.js <==
#!/usr/bin/env node

const fs  = require('fs'),
      log = console.log;

let w = fs.watch(__dirname, log);

process.on('SIGINT', () => {
  w.close();

  log('unwitch the directory');
  log('Game over after 5 second...');

  setTimeout(() => {
    process.exit();
  }, 5000);
});

==> 19-my-rm.js <==
#!/usr/bin/env node

const fs   = require('fs'),
      join = require('path').join,
      src  = process.argv[2];

if(typeof(src) === 'undefined') {
  console.error('请指定要删除的文件名或者目录名！');
  process.exit(1);
}

if(!fs.existsSync(src)) {
  console.error('%s not exist!', src);
  process.exit(2);
}

if(fs.statSync(src).isFile())  fs.unlinkSync(src);

if(fs.statSync(src).isDirectory()) deleteDir(src);

function deleteDir(folder) {
  let files = fs.readdirSync(folder);

  for(let i=0; i<files.length; i++) {
    let file = join(folder, files[i]);

    if(fs.statSync(file).isFile()) {
      fs.unlinkSync(file);
      continue;
    }

    if(fs.statSync(file).isDirectory()) deleteDir(file);
  }

  fs.rmdirSync(folder);
}

==> 20-ls-inode.js <==
#!/usr/bin/env node

const fs   = require('fs'),
      join = require('path').join,
      log  = console.log,
      src  = process.argv[2] || 'root';

let res = validate();

if(res.code !== 0) {
  console.error(res.msg);
  process.exit(res.code);
}

logInode(src);
lsInode(src);

function lsInode(folder) {
  let files = fs.readdirSync(folder);

  logInode(`${folder}/.`);
  logInode(`${folder}/..`);
  for(let i=0; i<files.length; i++) {
    let file = join(folder, files[i]);
    logInode(file);
  }
  log();

  for(let i=0; i<files.length; i++) {
    let file = join(folder, files[i]);
    if(fs.statSync(file).isDirectory()) {
      logInode(file);
      lsInode(file);
    }
  }
}

function logInode(folder) {
  let last = folder.split('/').pop();
  let dir = '', space = '                                   ';

  if(last === '.') {
    folder = folder.slice(0, folder.length-1);
    space  = space.slice(0, 20-1);
    dir    = '.';
  } else if(last === '..') {
    folder = join(folder.slice(0, folder.length-2), '..');
    space  = space.slice(0, 20-2);
    dir    = '..';
  } else {
    space = space.slice(0, 20-folder.length);
    dir   = folder;
  }

  log(`${dir} ${space} lnk: ${fs.statSync(folder).nlink} \t inode: ${fs.statSync(folder).ino}`);
}

function validate() {
  let res = {
    code: 0,
    msg: 'ok'
  };

  if(typeof(src) === 'undefined') {
    res.code = 1;
    res.msg  = 'dir is undefined';
  } else if(!fs.existsSync(src)) {
    res.code = 2;
    res.msg  = `${src} not exist!`;
  } else if(fs.statSync(src).isFile()) {
    res.code = 3;
    res.msg  = `${src} is not directory!`;
  } else {
    // ok
  }

  return res;
}
