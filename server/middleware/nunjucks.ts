import koaNunjucks from 'koa-nunjucks-2';
import { Context } from 'koa';

interface NunjucksConfig {
  manifest: StringMap;
  // the template dir
  path: string;
  globals?: { name: string; value: any }[];
  filters?: { name: string; func: anyFunc; async?: boolean }[];
}

export default (config: NunjucksConfig) => {
  return async function nunjucksMiddleware(ctx: Context, next: anyFunc) {
    const { manifest, path, globals = [], filters = [] } = config;
    const middleware = koaNunjucks({
      ext: 'njk',
      path,
      configureEnvironment: (env: any) => {
        function getScripts(page: string, prefetchJs = []) {
          const safe = env.filters.safe;
          const scripts = [...prefetchJs, `${page}.js`].map(x => manifest[x]);
          return safe(
            scripts
              .map(script => `<script src="${script}"></script>`)
              .join('\n')
          );
        }
        function getCSSLink(page: string, prefetchCSS = []) {
          const safe = env.filters.safe;
          const styles = [...prefetchCSS, `${page}.css`].map(x => manifest[x]);
          return safe(
            styles
              .map(style => `<Link rel="stylesheet" href="${style}" />`)
              .join('\n')
          );
        }

        function addScripts(this: any) {
          // this.ctx is nunjucks' context
          const { page, prefetchJs } = this.ctx;
          return getScripts(page, prefetchJs);
        }

        function addCSSLink(this: any) {
          const { page, prefetchCSS } = this.ctx;
          return getCSSLink(page, prefetchCSS);
        }

        globals.push({ name: 'addScripts', value: addScripts });
        globals.push({ name: 'addCSS', value: addCSSLink });

        globals.forEach(({ name, value }) => {
          env.addGlobal(name, value);
        });

        filters.forEach(({ name, func, async }) => {
          env.addFilter(name, func, async);
        });
      },
      nunjucksConfig: {
        trimBlocks: true
      }
    });

    await middleware(ctx, next);
  };
};
