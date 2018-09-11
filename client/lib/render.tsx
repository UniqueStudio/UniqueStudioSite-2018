import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import { ServerLocation } from '@reach/router';

function render(App: React.ComponentType) {
  if (__BROWSER__) {
    Loadable.preloadReady().then(() =>
      ReactDOM.hydrate(<App />, document.getElementById('root'))
    );
  } else {
    return ({ url }: { url: string }) => {
      return (
        <ServerLocation url={url}>
          <App />
        </ServerLocation>
      );
    };
  }
}

export default render;
