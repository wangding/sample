==> 01-information.js <==
#!/usr/bin/env node

const log = console.log;

log(`architecture: ${process.arch}`);
log(`platform:     ${process.platform}\n`);

log(`process id:   ${process.pid}`);
log(`exePath:      ${process.execPath}\n`);

log(`node version: ${process.version}`);
log(`user id:      ${process.getuid()}`);
log(`group id:     ${process.getgid()}`);
log(`cwd:          ${process.cwd()}\n`);

log('memoryUsage:');
console.dir(process.memoryUsage());

log('env:');
log(process.env);
log(`host name: ${process.env.HOSTNAME}`);

console.log('\nApp config:');
log(process.config);

process.report.writeReport();

const os = require('os');
log(os.cpus());
log(`linux uptime: ${os.uptime()} s`);
log(os.platform());
log(os.version());
log(os.networkInterfaces());
log(os.userInfo());

==> 02-calc.js <==
#!/usr/bin/env node

const log = console.log,
      arg = process.argv[2];

if(typeof(arg) === 'undefined' ||
    arg === '--help' ||
    arg === '-h') {
  help();
} else {
  calc();
}

function help() {
  log('\
usage: cmd-name [OPTION] [expression]\n\
evaluate the expression.\n\
\n\
Mandatory arguments to long options are mandatory for short options too.\n\
-h, --help output help information and exit');
}

function calc() {
  try {
    log(`${arg} = ${eval(arg)}`);
  } catch(e) {
    console.error(`${arg} 不是合法的数学表达式！`);
  }
}


==> 03-read-line.js <==
#!/usr/bin/env node

const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });

const msg   = ['Name', 'Email', 'QQ', 'Mobile'];
let me = {};

async function main() {
  for(let i=0; i<4; i++) {
    const answer = await rl.question(msg[i] + ': ');
    me[msg[i]] = answer;
  }

  rl.close();
  console.log(me);
}

main();

==> 03-std-io.js <==
#!/usr/bin/env node

const log   = console.log,
      stdin = process.stdin,
      stdout= process.stdout,
      msg   = ['Name', 'Email', 'QQ', 'Mobile'];

let me = {}, i = 1;

stdout.write(msg[0] + ': ');

stdin.on('data', (data) => {
  me[msg[i-1]] = data.slice(0, data.length - 1).toString('utf8');
  if(i === 4) {
    log(me);
    process.exit();
  }

  stdout.write(msg[i++] + ': ');
});

stdin.on('end', () => {
  log(me);
});

==> 04-exit-code.js <==
#!/usr/bin/env node

const log = console.log,
      err = console.error,
      arg = process.argv[2];

if(typeof(arg) === 'undefined') {
  err('缺少命令行参数！');
  process.exit(1);
}

if(isNaN(Number(arg))) {
  err('命令行参数不是合法数字！');
  process.exit(2);
}

log('退出码:', arg);
process.exit(arg);

==> 05-signal.js <==
#!/usr/bin/env node

const log = console.log;

log('PID:', process.pid);

process.stdin.resume();

process.on('SIGINT', () => {
  log('You have pressed Ctrl + C. Good bye!');
  process.exit();
});

process.on('SIGTSTP', () => {
  log('You have pressed Ctrl + Z.');
});

const os = require('os');

console.log(os.constants.signals);

==> 06-my-kill.js <==
#!/usr/bin/env node

const sig = process.argv[2],
      pid = process.argv[3],
      err = console.error;

if(process.argv.length < 4) {
  err('命令行参数少于两个！');
  process.exit(1);
}

if(process.argv.length > 4) {
  err('命令行参数多于两个！');
  process.exit(2);
}

if(isNaN(Number(pid))){
  err('pid 应该是数值');
  process.exit(3);
}

process.kill(pid, sig);
