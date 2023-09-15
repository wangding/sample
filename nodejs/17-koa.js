==> 03-hello-world/app.js <==
#!/usr/bin/env node

const Koa = require('koa');
const app = new Koa(),
      log = console.log;

app.use((ctx, next) => {
  log('hello world');
  ctx.body = 'hello world';
});

app.listen(8080);

==> 04-middleware/01-logger.js <==
#!/usr/bin/env node

const Koa = require('koa');
const app = new Koa(),
      log = console.log;

app.use((ctx, next) => {            // M-logger
  log(`${ctx.method} ${ctx.path}`);
  next();
});

app.use((ctx, next) => {            // M-hello
  ctx.body = 'hello world!';
});

app.listen(8080);

==> 04-middleware/02-logger-ms.js <==
#!/usr/bin/env node

const Koa = require('koa');
const app = new Koa(),
      log = console.log;

app.use((ctx, next) => {
  log(`${ctx.method} ${ctx.path}`);
  next();
});

app.use((ctx, next) => {
  const start = Date.now();

  next();
  const end  = Date.now();
  log(`cost: ${end-start}`);
});

app.use((ctx, next) => {
  ctx.body = 'hello world!';
});

app.listen(8080);

==> 04-middleware/03-pass-data.js <==
#!/usr/bin/env node

const Koa = require('koa');
const app = new Koa(),
      log = console.log;

app.use((ctx, next) => {
  next();
  const cost = ctx.response.get('cost');
  //const cost = ctx.cost;
  log(`${ctx.method} ${ctx.path} - ${cost}ms`);
});

app.use((ctx, next) => {
  const start = Date.now();

  next();
  const end  = Date.now();
  ctx.set('cost', end-start);
  //ctx.cost = end - start;
});

app.use((ctx, next) => {
  ctx.body = 'hello world!';
});

app.listen(8080);

==> 04-middleware/04-power-logger.js <==
#!/usr/bin/env node

const Koa = require('koa');
const app = new Koa(),
      log = console.log;

app.use((ctx, next) => {
  const start = Date.now();
  next();
  const end  = Date.now();
  log(`${ctx.method} ${ctx.path} - ${end-start}ms`);
});

app.use((ctx, next) => {
  ctx.body = 'hello world!';
});

app.listen(8080);

==> 04-middleware/middleware/logger.js <==
async function logger(ctx, next) {
  const start = Date.now();
  await next();
  const end  = Date.now();
  console.log(`${ctx.method} ${ctx.path} - ${end-start}ms`);
}

module.exports = logger;

==> 04-middleware/05-logger-middleware.js <==
#!/usr/bin/env node

const Koa    = require('koa'),
      logger = require('./middleware/logger');

const app = new Koa();

app.use(logger);

app.use((ctx, next) => {
  ctx.body = 'hello world!';
});

app.listen(8080);

==> 04-middleware/lib/task.js <==
const {setTimeout:sleep} = require('timers/promises');
const report = (id, cost) => console.log(`#${id} task done, use ${cost} ms.\n`);

async function fakeAsync(id) {
  const delay = Math.round(Math.random() * 1000);
  await sleep(delay);
  report(id, delay);
  return delay;
}

module.exports = fakeAsync;

==> 04-middleware/06-middleware-await.js <==
#!/usr/bin/env node

const Koa = require('koa'),
      fakeAsync = require('./lib/task');

const app = new Koa(),
      log = console.log;

app.use(async(ctx, next) => {
  const start = Date.now();
  await next();
  const end  = Date.now();
  log(`${ctx.method} ${ctx.path} - ${end-start}ms`);
});

app.use(async(ctx, next) => {
  ctx.body = 'hello world! ' + await fakeAsync(1) + 'ms';
});

app.listen(8080);

==> 04-middleware/07-koa-logger.js <==
#!/usr/bin/env node

const Koa    = require('koa'),
      logger = require('koa-logger');

const app = new Koa();

app.use(logger());

app.use(async(ctx, next) => {
  ctx.body = 'hello world!';
});

app.listen(8080);

==> 05-router/01-origin-router.js <==
#!/usr/bin/env node

const Koa = require('koa');

const app = new Koa(),
      log = console.log;

app.use(async (ctx, next) => {
  if(ctx.method === 'GET' && ctx.path === '/authors/') {
    log('得到漫画书作者列表');
    ctx.body = '查询成功';
  }

  if(ctx.method === 'GET' && /\/authors\/\w/.test(ctx.path)) {
    log('按作者名查询');
    ctx.body = '查询成功';
  }

  if(ctx.method === 'POST' && ctx.path === '/authors/') {
    log('添加新的漫画书作者');
    ctx.body = '添加成功';
  }

  if(ctx.method === 'PUT' && /\/authors\/(\d)+$/.test(ctx.path)) {
    log('修改某 ID 的漫画书作者名称');
    ctx.body = '修改成功';
  }

  if(ctx.method === 'DELETE' && /\/authors\/(\d)+$/.test(ctx.path)) {
    log('删除某 ID 的漫画书作者');
    ctx.body = '删除成功';
  }
});

app.listen(8080);

==> 05-router/02-koa-router.js <==
#!/usr/bin/env node

const Koa    = require('koa'),
      Router = require('koa-router');

const app    = new Koa(),
      log    = console.log,
      router = new Router();

router.get('/authors/', async (ctx, next) => {
  log('得到漫画书作者列表');
  ctx.body = '查询成功';
});

router.get('/authors/:authorName', async (ctx, next) => {
  log('按作者名查询');
  ctx.body = '查询成功';
});

router.post('/authors/', async (ctx, next) => {
  log('添加新的漫画书作者');
  ctx.body = '添加成功';
});

router.put('/authors/:id', async (ctx, next) => {
  log('修改某 ID 的漫画书作者名称');
  ctx.body = '修改成功';
});

router.delete('/authors/:id', async (ctx, next) => {
  log('删除某 ID 的漫画书作者');
  ctx.body = '删除成功';
});

app.use(router.routes());

app.listen(8080);

==> 05-router/03-get-request-data.js <==
#!/usr/bin/env node

const Koa    = require('koa'),
      bodyparser = require('koa-bodyparser'), 
      Router = require('koa-router');

const app    = new Koa(),
      log    = console.log,
      router = new Router();

app.use(bodyparser({ enableTypes: ['json', 'form', 'text'] }))

router.get('/authors/', async (ctx, next) => {
  var { page, limit } = ctx.query;

  log(ctx.header['user-agent']);
  log(`得到漫画书作者列表，page = ${page}, limit = ${limit}`);
  ctx.body = '查询成功';
});

router.get('/authors/:authorName', async (ctx, next) => {
  var { authorName } = ctx.params;

  log(`按作者名查询，authorName = ${authorName}`);
  ctx.body = '查询成功';
});

router.post('/authors/', async (ctx, next) => {
  var { authorName } = ctx.request.body;

  log(`添加漫画书作者，authorName = ${authorName}`);
  ctx.body = '添加成功';
});

router.put('/authors/:id', async (ctx, next) => {
  var { id } = ctx.params;
  var { authorName } = ctx.request.body;

  log(`修改 ID 为 ${id} 的漫画书作者名称为 ${authorName}`);
  ctx.body = '修改成功';
});

router.delete('/authors/:id', async (ctx, next) => {
  var { id } = ctx.params;

  log(`删除 ID 为 ${id} 的漫画书作者`);
  ctx.body = '删除成功';
});

app.use(router.routes());

app.listen(8080);

==> 05-router/routes/authors.js <==
const router = require('koa-router')(),
      log    = console.log;

router.prefix('/authors');

router.get('/', async (ctx, next) => {
  var { page, limit } = ctx.query;

  log(`得到漫画书作者列表，page = ${page}, limit = ${limit}`);
  ctx.body = '查询成功';
});

router.get('/:authorName', async (ctx, next) => {
  var { authorName } = ctx.params;

  log(`按作者名查询，authorName = ${authorName}`);
  ctx.body = '查询成功';
});

router.post('/', async (ctx, next) => {
  var { authorName } = ctx.request.body;

  log(`添加漫画书作者，authorName = ${authorName}`);
  ctx.body = '添加成功';
});

router.put('/:id', async (ctx, next) => {
  var { id } = ctx.params;
  var { authorName } = ctx.request.body;

  log(`修改 ID 为 ${id} 的漫画书作者名称为 ${authorName}`);
  ctx.body = '修改成功';
});

router.delete('/:id', async (ctx, next) => {
  var { id } = ctx.params;

  log(`删除 ID 为 ${id} 的漫画书作者`);
  ctx.body = '删除成功';
});

module.exports = router;

==> 05-router/04-koa-router-module.js <==
#!/usr/bin/env node

const Koa     = require('koa'),
      bodyparser = require('koa-bodyparser'),
      authors = require('./routes/authors');

const app     = new Koa();

app.use(bodyparser({ enableTypes: ['json', 'form', 'text'] }))

app.use(authors.routes())

app.listen(8080);

==> 05-router/05-router-manager.js <==
#!/usr/bin/env node

const Koa    = require('koa'),
      bodyparser = require('koa-bodyparser'),
      /*
      authors = require('./routes/authors'),
      tags   = require('./routes/tags'),
      areas  = require('./routes/areas'),
      */
      loadRouters = require('require-directory');

const app    = new Koa();

/*
app.use(authors.routes());
app.use(areas.routes());
app.use(tags.routes());
*/
app.use(bodyparser({ enableTypes: ['json', 'form', 'text'] }))

loadRouters(module, './routes', {visit: (r)=>{
  app.use(r.routes());
}});

app.listen(8080);
