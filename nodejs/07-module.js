==> 01-chalk.js <==
#!/usr/bin/env node

const chalk = require('chalk'),
      log   = console.log;

log('This is ' + chalk.red('red.'));
log('This is ' + chalk.green('green.'));
log('This is ' + chalk.red('red') + ' and ' + chalk.green('green.'));

==> 02-export-var.js <==
module.exports = Math.PI;

console.log(module);

==> 02-main.js <==
#!/usr/bin/env node

const pi    = require('./02-export-var'),
      chalk = require('chalk'),
      log   = console.log,
      red   = chalk.redBright;

log(red('-----------------------'));
log(red(`PI: ${pi}`));
log(red('-----------------------'));

log(module);

==> 03-export-function.js <==
const pi = Math.PI;

module.exports = (radius) => {
  return {
    area() {
      return pi * radius * radius;
    },
    diameter() {
      return 2 * radius;
    },
    circumference() {
      return pi * 2 * radius;
    }
  };
};

console.log(module);

==> 03-main.js <==
#!/usr/bin/env node

const circle = require('./03-export-function'),
      chalk = require('chalk'),
      log   = console.log,
      red   = chalk.redBright;

const c = circle(20);

log(red('-----------------------------------'));
log(red(`area:         \t${c.area()}`));
log(red(`diameter:     \t${c.diameter()}`));
log(red(`circumference:\t${c.circumference()}`));
log(red('-----------------------------------'));

log(module);

==> 04-export-object.js <==
const pi = Math.PI;

class Circle {
  constructor(radius) {
    this.#r = radius;
  }

  get diameter() {
    return 2 * this.#r;
  }

  get circumference() {
    return pi * 2 * this.#r;
  }

  get area() {
    return pi * this.#r * this.#r;
  }

  #r = 0;
}

module.exports = Circle;

console.log(module);

==> 04-main.js <==
#!/usr/bin/env node

const Circle = require('./04-export-object.js'),
      chalk = require('chalk'),
      log   = console.log,
      red   = chalk.redBright;

const c = new Circle(20);

log(red('-----------------------------------'));
log(red(`area:           ${c.area}`));
log(red(`diameter:       ${c.diameter}`));
log(red(`circumference:  ${c.circumference}`));
log(red('-----------------------------------'));

log(module);

==> 05-export-object.js <==
const pi = Math.PI;

module.exports = {
  diameter(radius) {
    return 2 * radius;
  },

  circumference(radius) {
    return pi * 2 * radius;
  },

  area(radius) {
    return pi * radius * radius;
  }
};

console.log(module);

==> 05-main.js <==
#!/usr/bin/env node

const circle = require('./05-export-object.js'),
      chalk = require('chalk'),
      log   = console.log,
      red   = chalk.redBright;

log(red('-----------------------------------'));
log(red(`area:         \t${circle.area(20)}`));
log(red(`diameter:     \t${circle.diameter(20)}`));
log(red(`circumference:\t${circle.circumference(20)}`));
log(red('-----------------------------------'));

log(module);

==> 06-export-object.js <==
const pi = Math.PI;

module.exports.diameter = (radius) => 2 * radius;
module.exports.circumference = (radius) => pi * 2 * radius;
module.exports.area = (radius) => pi * radius * radius;

console.log(module);

==> 06-main.js <==
#!/usr/bin/env node

const circle = require('./06-export-object.js'),
      chalk = require('chalk'),
      log   = console.log,
      red   = chalk.redBright;

log(red('-----------------------------------'));
log(red(`area:         \t${circle.area(20)}`));
log(red(`diameter:     \t${circle.diameter(20)}`));
log(red(`circumference:\t${circle.circumference(20)}`));
log(red('-----------------------------------'));

log(module);

==> 07-main.js <==
#!/usr/bin/env node

const Num = require('./07-share'),
      log = console.log;

const n1 = new Num();
const n2 = new Num();

n1.add();
n1.add();

log('n1 =', n1.getCount());
log('n2 =', n2.getCount());
log('');

n2.add();

log('n1 =', n1.getCount());
log('n2 =', n2.getCount());

==> 07-share.js <==
let count = 0;

function Num() {}

Num.prototype.add = () => count++;
Num.prototype.getCount = () => count;

module.exports = Num;

==> 08-main.js <==
#!/usr/bin/env node

/*
 * cd ./08-circle && npm link
 * cd .. && npm link circle
 */
const circle = require('circle'),
      log    = console.log;

log('area:          ', circle.area(20));
log('diameter:      ', circle.diameter(20));
log('circumference: ', circle.circumference(20));

==> 09-es6-module.mjs <==
#!/usr/bin/env node

import http from 'http';
import chalk from 'chalk';

http.createServer((req, res) => {
  console.log(chalk.greenBright(`${req.method} ${req.url} HTTP/${req.httpVersion}`));
  res.end('hello world');
}).listen(8080);

==> 09-export-object.mjs <==
const pi = Math.PI;

class Circle {
  constructor(radius) {
    this.#r = radius;
  }

  get diameter() {
    return 2 * this.#r;
  }

  get circumference() {
    return pi * 2 * this.#r;
  }

  get area() {
    return pi * this.#r * this.#r;
  }

  #r = 0;
}

export default Circle;

==> 09-main.mjs <==
#!/usr/bin/env node

import Circle from './09-export-object.mjs';

const c   = new Circle(process.argv[2] || 0),
      log = console.log;

log(`circle area:          ${c.area}`);
log(`circle circumference: ${c.circumference}`);
