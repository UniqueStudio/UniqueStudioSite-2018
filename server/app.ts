import Loadable from 'react-loadable';
import Koa from 'koa';
import router from './routes';
import nunjucks from './middleware/nunjucks';
import manifest from './public/buildClient/manifest.json';
import * as path from 'path';
import serve from 'koa-static';

const app = new Koa();

app.use(
  nunjucks({
    path: path.join(__dirname, './template'),
    manifest
  })
);

app.use(serve('./static'));

app.use(async (ctx, next) => {
  console.log(ctx.request.url);
  await next();
});

app.use(router.routes());

async function startServer() {
  await Loadable.preloadAll();
  app.listen(3334, () => {
    console.log('start server at port: ', 3333);
  });
}

startServer();
