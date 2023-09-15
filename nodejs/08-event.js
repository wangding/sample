==> 01-event-emitter.js <==
#!/usr/bin/env node

const EventEmitter = require('events').EventEmitter,
      log          = console.log,
      e            = new EventEmitter();

setInterval(() => {
  e.emit('hello');
}, 1000);

setTimeout(() => {
  e.emit('bye');
}, 5000);

e.on('hello', () => {
  log('hello world!');
});

e.on('bye', () => {
  log('goodbye!');
  process.exit();
});

==> 02-dog.js <==
const { EventEmitter } = require('events');

class Dog extends EventEmitter {
  constructor(name, energy) {
    super();
    this.#name   = name;
    this.#energy = energy;
    this.#startTimer();
  }

  get name() { return this.#name; }
  get energy() { return this.#energy; }
  setEnergy(e) {
    this.#energy = e;
    this.#startTimer();
  }

  #name   = '';
  #energy = 0;
  #timer  = null;

  #startTimer() {
    if(this.#timer !== null) return;

    this.#timer = setInterval(()=> {
      if(this.#energy > 0) {
        this.emit('bark');
        this.#energy--;
      } else {
        clearInterval(this.#timer);
        this.#timer = null;
      }
    }, 1000);
  }
}

module.exports = Dog;

==> 02-play-dog.js <==
#!/usr/bin/env node

const Dog = require('./02-dog');

let taidi  = new Dog('taidi', 4),
    zangao = new Dog('zangao', 8);

taidi.on('bark', onBark);
zangao.on('bark', onBark);

function onBark() {
  console.log(`${this.name} barked! energy: ${this.energy}`);
}

setTimeout(() => {
  console.log('taidi eat food, start bark!');
  taidi.setEnergy(3);
}, 10000);

==> 03-listen-radio.js <==
#!/usr/bin/env node

const Radio = require('./03-radio'),
      log   = console.log;

const station = {
  freq: '106.7',
  name: 'music radio'
};

let radio = new Radio(station);

radio.on('open', (station) => {
  log('"%s" FM %s opened', station.name, station.freq);
  log('lalala...');
});

radio.on('stop', (station) => {
  log('"%s" FM %s closed', station.name, station.freq);
});

==> 03-radio.js <==
const EventEmitter = require('events').EventEmitter,
      util         = require('util');

function Radio(station) {
  EventEmitter.call(this);

  let self = this;

  setTimeout(() => {
    self.emit('open', station);
  }, 0);

  setTimeout(() => {
    self.emit('stop', station);
  }, 5000);
}

util.inherits(Radio, EventEmitter);

module.exports = Radio;

==> 04-listen-radio.js <==
#!/usr/bin/env node

const Radio   = require('./04-radio.js'),
      log     = console.log,
      station = {
        'freq': '106.7',
        'name': 'music Radio'
      };

let r = new Radio(station);

r.on('play', (station) => {
  log('FM %s %s is playing!', station.freq, station.name);
});

r.on('stop', (station) => {
  log('FM %s %s is stop!', station.freq, station.name);
});

==> 04-radio.js <==
const EventEmitter = require('events').EventEmitter;

function Radio(station) {
  let that = this;

  for(let m in EventEmitter.prototype) {
    this[m] = EventEmitter.prototype[m];
  }

  setTimeout(() => {
    that.emit('play', station);
  }, 0);

  setTimeout(() => {
    that.emit('stop', station);
  }, 5000);
}

module.exports = Radio;

==> 05-dog.js <==
const Event = require('./05-event.js');

class Dog extends Event {
  constructor(name, energy) {
    super();
    this.#name   = name;
    this.#energy = energy;
    this.#startTimer();
  }

  get name() { return this.#name; }
  get energy() { return this.#energy; }
  setEnergy(e) {
    this.#energy = e;
    this.#startTimer();
  }

  #name      = '';
  #energy    = 0;
  #timer     = null;

  #startTimer() {
    if(this.#timer !== null) return;

    this.#timer = setInterval(() => {
      if(this.#energy > 0) {
        this.emit('bark');
        this.#energy--;
      } else {
        clearInterval(this.#timer);
        this.#timer = null;
      }
    }, 1000);
  }
}

module.exports = Dog;

==> 05-event.js <==
class Event {
  on(evt, fn) {
    if(typeof(this.#listeners[evt]) === 'undefined') {
      this.#listeners[evt] = [];
    }

    this.#listeners[evt].push(fn);
  }

  emit(evt, arg) {
    if(typeof(this.#listeners[evt]) === 'undefined') {
      throw(new Error(`${evt} is not defined!`));
    }

    this.#listeners[evt].forEach((fn) => {
      fn.call(this, arg);
    });
  }

  #listeners = {};
}

module.exports = Event;

==> 05-play-dog.js <==
#!/usr/bin/env node

const Dog = require('./05-dog');

let taidi  = new Dog('taidi', 4),
    zangao = new Dog('zangao', 8);

taidi.on('bark', onBark.bind(taidi));
zangao.on('bark', onBark.bind(zangao));

function onBark() {
  console.log(`${this.name} barked! energy: ${this.energy}`);
}

setTimeout(() => {
  console.log('taidi eat foold');
  taidi.setEnergy(3);
}, 10000);

==> 06-listen-radio.js <==
#!/usr/bin/env node

const Radio = require('./06-radio'),
      station = {
        freq: '106.7',
        name: 'music radio'
      };

let radio = new Radio(station);

radio.on('open', (s) => {
  console.log('"%s" FM %s opened', s.name, s.freq);
  console.log('lalala...');
});

radio.on('stop', (s) => {
  console.log('"%s" FM %s closed', s.name, s.freq);
});

==> 06-radio.js <==
const Event = require('./05-event.js');

class Radio extends Event {
  constructor(station) {
    super();
    this.#station = station;
  }

  #open = setTimeout(() => {
    this.emit('open', this.#station);
    clearTimeout(this.#open);
  }, 0);

  #stop = setTimeout(() => {
    this.emit('stop', this.#station);
    clearTimeout(this.#stop);
  }, 5000);

  #station;
}

module.exports = Radio;

==> 07-prd-csm.js <==
#!/usr/bin/env node

const EventEmitter = require('events').EventEmitter;
const log = console.log;

class Queue extends EventEmitter {
  constructor() {
    super();
  }

  write(data) {
    this.#data.push(data);
    this.emit('data');
  }

  read() {
    return this.#data.shift();
  }

  log() {
    log(this.#data);
  }

  #data = [];
}

class Producer {
  constructor(queue) {
    this.#queue = queue;
  }

  create(data){
    log('+ prd create:', data);
    this.#queue.write(data);
  }

  #queue = null;
}

class Consumer {
  constructor(queue) {
    this.#queue = queue;
  }

  destroy(){
    log('- csm destroy:', this.#queue.read());
  }

  #queue = null;
}

function main() {
  const queue = new Queue(),
        prd   = new Producer(queue),
        csm   = new Consumer(queue);

  queue.on('data', ()=>csm.destroy());

  for(let i=0; i<5; i++) prd.create(i);
}

main();

==> 08-async.js <==
#!/usr/bin/env node

const {EventEmitter} = require('events'),
      log            = console.log;

class MyClass extends EventEmitter {}

const mc = new MyClass();

mc.on('hello', (a)=>{
  log('1:', a);  // 同步
  //setImmediate(()=>log('1:', a));  // 异步
});

mc.on('hello', (a)=>{
  log('2:', a);
});

mc.emit('hello', 100);

==> 09-error.js <==
#!/usr/bin/env node

const {EventEmitter, errorMonitor} = require('events'),
      log = console.log;

const ee = new EventEmitter();

/*
ee.on('error', (err)=>{ // 捕获异常，正常退出
  log(err.message);
});
*/

ee.on(errorMonitor, (err)=>{ // 捕获异常，异常退出
  log(err.message);
});

ee.emit('error', new Error('Something wrong!'));

/*
try {
  throw new Error('Something wrong!');
} catch(e) {
  log(e.message);
}*/

==> 10-rejection.js <==
#!/usr/bin/env node

/* global Symbol: true */

const {EventEmitter} = require('events');

//const ee = new EventEmitter();
const ee = new EventEmitter({ captureRejections: true  });

ee.on('something', async ()=>{
  throw new Error('Something wrong!');
});

/* 可以捕获异常 
ee.on('error', (err)=>{
  console.log(err.message);
});
*/

// 不能捕获异常
ee[Symbol.for('nodejs.rejection')] = console.log;

ee.emit('something');

==> 11-event-target.js <==
#!/usr/bin/env node

const target = new EventTarget(),
      log    = console.log;

target.addEventListener('foo', (e) => {
  log(e.type);
  log(e.value);
});

const e = new Event('foo');
e.value = 'abc';

target.dispatchEvent(e);
