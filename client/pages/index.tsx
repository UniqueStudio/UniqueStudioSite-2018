import * as React from 'react';
import { Router } from '@reach/router';
import Header from 'components/Header';
import routes from 'routes';
import './index.less'
import 'normalize.css';

class App extends React.Component<{}> {
  render() {
    return (
      <>
        <Header />
        <Router primary={false}>
          {routes.map(({ id, path, Component }) => {
            return <Component path={path} key={id} />;
          })}
        </Router>
      </>
    );
  }
}

export default App;
