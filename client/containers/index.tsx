import * as React from 'react';
import Loadable from 'react-loadable';
import Loading from 'components/loading';
import { Link, Router } from '@reach/router';

const IncrementLoadable = Loadable({
  loader: () =>
    import(/* webpackPrefetch: true, crossOriginLoading: true */ 'components/increment'),
  loading: Loading,
  delay: 200
});

const HelloLoadable = Loadable({
  loader: () => import(/* webpackPrefetch: true */ 'components/hello'),
  loading: Loading,
  delay: 200
});

class App extends React.Component<{}> {
  render() {
    return (
      <>
        <nav style={{ display: 'flex' }}>
          <Link to="/hello">hello</Link>
          <Link to="/increment">Increment</Link>
        </nav>
        <Router>
          <HelloLoadable path="/hello" />
          <IncrementLoadable path="/increment" />
        </Router>
      </>
    );
  }
}

export default App;
