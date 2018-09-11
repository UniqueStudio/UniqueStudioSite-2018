import { Context } from 'koa';
import getAsset from '../lib/getAsset';
import { isRedirect } from '@reach/router';
import App from '../public/buildServer/index';

export default async (ctx: Context) => {
  try {
    const { html, scripts: prefetchJs, styles: prefetchCSS } = getAsset({
      App,
      url: ctx.url
    });
    await ctx.render('index', {
      page: 'index',
      prefetchJs,
      prefetchCSS,
      html
    });
  } catch (err) {
    if (isRedirect(err)) {
      ctx.redirect(err.uri);
    } else {
      ctx.throw(500, err.message);
    }
  }
};
