import * as React from 'react';
import ReactServerDOM from 'react-dom/server';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';

interface Bundle {
  file: string;
}

export default function getAsset({ App, url }: { App?: any; url: string }) {
  const stats = require('../public/buildClient/react-loadable.json');
  let modules: string[] = [];
  let html = ReactServerDOM.renderToString(
    <Loadable.Capture report={(moduleName: string) => modules.push(moduleName)}>
      <App url={url} />
    </Loadable.Capture>
  );
  let bundles: Bundle[] = getBundles(stats, modules);
  const styles = bundles
    .filter(bundle => bundle && bundle.file.endsWith('.css'))
    .map(bundle => bundle.file);
  const scripts = bundles
    .filter(bundle => bundle && bundle.file.endsWith('.js'))
    .map(bundle => bundle.file);
  return {
    html,
    scripts,
    styles
  };
}
