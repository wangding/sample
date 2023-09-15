==> 01-format.js <==
#!/usr/bin/env node

const user = {
  name: '王顶',
  age:  41,
  qq:   '408542507'
};

const log = console.log;

// 占位符
log('name: %s', user.name);   // 字符串类型
log('age: %d', user.age);     // 整数类型
log('num: %i', 45);           // 整数类型
log('PI:  %f', 3.14);         // 浮点数
log('JSON: %j', user);        // 对象类型
log('Object: %o', user);      // 对象类型

log('qq: %s', user.qq);       // 输出方式一：占位符输出
log('qq:', user.qq);          // 输出方式二：逗号间隔，多变量输出
log('qq: ' + user.qq);        // 输出方式三：拼接字符串输出
log(`qq: ${user.qq}`);        // 输出方式四：模板字符串输出

console.dir(user);
console.dir([user, user]);
console.dir({o: {b: {j: user}}});
console.dir({o: {b: {j: user}}}, {depth: null});

console.table(user);
console.table([user, user, user]);
console.table([user, user, user], ['name', 'qq']);
// console.table 最适合打印数据库的查询数据，因为查询结果就是表格

console.error('Error! something wrong!');

==> 02-time.js <==
#!/usr/bin/env node

console.time('TEST');
longTask();
console.timeEnd('TEST');

function longTask() {
  let n;

  for(let i=0; i<10000; i++) {
    for(let j=0; j<10000; j++) {
      n = i * j;
    }
  }

  return n;
}

==> 03-menu.js <==
#!/usr/bin/env node

function menu() {
  const tab = ' '.repeat(10);
  const msg = `${tab} [1] 加法运算\n` +
              `${tab} [2] 减法运算\n` +
              `${tab} [3] 乘法运算\n` +
              `${tab} [4] 除法运算\n` +
              '\n' +
              `${tab} 请输入您的选项：`;

  console.clear();
  console.log(msg);
}

menu();

==> 04-assert.js <==
#!/usr/bin/env node

const log = console.log;

console.clear();
console.assert(true);
log('hello');

// 断言失败不中断程序的执行
console.assert(false, 'Something wrong!');

log('world');

==> 05-class.js <==
#!/usr/bin/env node

const fs = require('fs'),
      { Console } = console;

const method = process.argv[2];

let logger;

if(method === 'stdout') {
  logger = console.log;
} else if(method === 'file') {
  const output = fs.createWriteStream('./stdout.log');
  logger = new Console({ stdout: output });
  logger = logger.log;
} else {
  console.log('usage: cmd stdout|file');
  process.exit();
}

logger('hello world');
