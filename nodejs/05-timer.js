==> 01-bomb.js <==
#!/usr/bin/env node

const log = console.log;

class Bomb {
  constructor(id) {
    this.#id = id;
  }

  start() {
    log(`#${this.#id} It will bomb after 3 second!`);
    this.#timerID = setTimeout(() => {
      log(`#${this.#id} BOMB!!!`);
    }, 3000);
  }

  clear() {
    clearTimeout(this.#timerID);
    log(`#${this.#id} is safe!`);
  }

  #id;
  #timerID;
}

let b1 = new Bomb(1);
b1.start();

let b2 = new Bomb(2);
b2.start();
setTimeout(b2.clear.bind(b2), 1000);

==> 02-timer.js <==
#!/usr/bin/env node

const log = console.log;

let timer1, timer2, count = 1;

log('start timer1...');

timer1 = setInterval(loop1, 500);

setTimeout(() => {
  log('Game Over!');
  clearInterval(timer1);
  log('start timer2...');
  timer2 = setInterval(loop2, 500);
}, 5000);

function loop1() {
  log('#1 I will loop forever!');
}

function loop2() {
  log('#2 I will loop forever!');
  if(count++ >= 5) {
    count = 0;
    log('Game Over!');
    global.clearInterval(timer2);
  }
}

==> 03-sleep.js <==
#!/usr/bin/env node

// cmd: echo hello; sleep 2; echo world

/* global Promise:true */
const log = console.log;
const { setTimeout:delay } = require('timers/promises');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

async function fn() {
  log('hello');
  await sleep(2000);
  log('world\n');

  log('wang');
  await delay(2000);
  log('ding\n');
}

log('abc');
setTimeout(() => {
  log('def\n');
  fn();
}, 2000);
