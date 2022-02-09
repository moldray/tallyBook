const Koa = require('koa');
const Router = require('@koa/router');
const serve = require('koa-static')
const views = require('koa-views');
const csvdata = require('csvdata');
const request = require('request');

const app = new Koa();
const router = new Router();

if (process.env.NODE_ENV === 'prod') {
  const render = views(__dirname + '/dist', {
    map: {
      html: 'ejs'
    }
  })
  app.use(render)
  router.get('/', async (ctx) => {
    await ctx.render('index');
  });
} else {
  app.use(async (ctx, next) => {
    if(!ctx.url.startsWith('/api/')){
      ctx.body = ctx.req.pipe(request('http://127.0.0.1:3000' + ctx.url));
    }
    await next()
  });
  setTimeout(() => {
    console.log(`devServer: http://localhost:9651/`)
  })
}

router.get('/api/raw', async (ctx) => {
  const bills = await csvdata.load('./data/bill.csv')
  const categories = await csvdata.load('./data/categories.csv')
  ctx.body = {bills, categories}
});

app.use(router.routes()).use(router.allowedMethods());

if (process.env.NODE_ENV === 'prod') {
  app.use(serve(__dirname + '/dist'));
}

app.listen(9651);
