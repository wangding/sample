==> 01-my-curl-by-fetch.js <==
#!/usr/bin/env node

const log  = console.log,
      url  = process.argv[2] || 'http://sample.wangding.co/web/one-div.html',
      headers = { 'User-Agent': '01-my-curl.js' };

fetch(url, headers)
  .then(res => {
    log(`HTTP/1.1 ${res.status} ${res.statusText}`);
    log(res.headers);
    return res.text();
  })
  .then(body => log(body));

==> 01-my-curl.js <==
#!/usr/bin/env node

const http = require('http'),
      log  = console.log,
      url  = process.argv[2] || 'http://sample.wangding.co/web/one-div.html',
      headers = { 'User-Agent': '01-my-curl.js' };

http.get(url, {headers}, (res) => {
  log(`HTTP/${res.httpVersion} ${res.statusCode} ${res.statusMessage}`);
  log(res.headers);
  log('');

  res.pipe(process.stdout);
});

==> 02-get-weather-by-fetch.js <==
#!/usr/bin/env node

const cityCode = {
  '北京': 101010100,
  '上海': 101020100,
  '天津': 101030100,
  '重庆': 101040100,
  '香港': 101320101,
  '澳门': 101330101,
  '石家庄': 101090101,
};

const city = process.argv[2] || '石家庄',
      addr = 'http://t.weather.sojson.com/api/weather/city/' + cityCode[city];

fetch(addr)
  .then(res => res.json())
  .then(data => console.dir(data, { depth: null, colors: true }));

==> 02-get-weather.js <==
#!/usr/bin/env node

const http = require('http');

const cityCode = {
  '北京': 101010100,
  '上海': 101020100,
  '天津': 101030100,
  '重庆': 101040100,
  '香港': 101320101,
  '澳门': 101330101,
  '石家庄': 101090101,
};

const city = process.argv[2] || '石家庄',
      addr = 'http://t.weather.sojson.com/api/weather/city/' + cityCode[city];

http.get(addr, res => {
  let data = '';

  res.on('data', chunk => data += chunk.toString('utf8'));
  res.on('end', () => {
    data = JSON.parse(data);
    console.dir(data, { depth: null, colors: true });
  });
});

==> 03-get-repos.js <==
#!/usr/bin/env node

const https = require('https');

const url = 'https://api.github.com/search/repositories?q=user:' + (process.argv[2] || 'wangding'),
      log = console.log,
      headers = { 'User-Agent': '02-get-repos.js' };

https.get(url, {headers}, (res) => {
  let result = '';

  res.on('data', (data) => result += data.toString('utf8'));
  res.on('end', () => {
    let reps = JSON.parse(result);

    log('Total:', reps.items.length);
    log('==========================');
    for(let i=0; i<reps.items.length; i++) {
      log('%d\t%s', (i + 1), reps.items[i].name);
    }
  });
});

==> 04-post.js <==
#!/usr/bin/env node

const http = require('http');

const msg = process.argv[2] || 'Hello! I am wangding.',
      log = console.log,
      method = 'POST',
      url = 'http://localhost:8080';

let req = http.request(url, {method}, (res) => {
  log(`HTTP/${res.httpVersion} ${res.statusCode} ${res.statusMessage}`);
  log(res.headers);
  log('');

  res.pipe(process.stdout);
});

req.end(msg + '\n');

==> 04-server.js <==
#!/usr/bin/env node

const http = require('http'),
      log  = console.log;

http.createServer((req, res) => {
  log(`\n${req.method} ${req.url} HTTP/${req.httpVersion}`);
  log(req.headers);
  log('');
  req.pipe(process.stdout);

  res.end('OK!');
}).listen(8080);

==> 05-crawler.js <==
#!/usr/bin/env node

const http    = require('https'),
      cheerio = require('cheerio'),
      log     = console.log,
      print   = require('util').debuglog('crawler'),
      baseURL = 'https://ke.segmentfault.com/',
      url     = baseURL + 'free';

http.get(url, (res) => {
  let result = '';

  print(`HTTP/${res.httpVersion} ${res.statusCode} ${res.statusMessage}`);
  print(res.headers);
  print('');

  res.on('data', chunk => result += chunk);
  res.on('end', () => {
    print(result);

    let $ = cheerio.load(result);
    $('body').find('.card-title>a').each(function(){
      let cName = $(this).text(),
          cURL  = baseURL + $(this).attr('href');

      if(cName === '') return;

      log('课程名称：', cName);
      log('课程网址：', cURL.trim());
      log('');
    });
  });
});

==> 06-redirection.js <==
#!/usr/bin/env node

const http = require('http'),
      url  = require('url'),
      log  = console.log;

let addr = process.argv[2] || 'http://www.sian.com/';

function opt(addr) {
  let options = url.parse(addr);
  options.headers = { 'User-Agent': '05-redirection.js' };

  return options;
}

function get(options) {
  http.get(options, (res) => {
    log(`HTTP/${res.httpVersion} ${res.statusCode} ${res.statusMessage}`);
    log(res.headers);
    log('');

    if(res.statusCode < 400 && res.statusCode >= 300) {
      get(opt(res.headers.location));
    } else {
      res.pipe(process.stdout);
    }
  });
}

get(opt(addr));
