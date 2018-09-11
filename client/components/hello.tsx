import * as React from 'react';
import './hello.less';
import './hello2.less';
import { RouteComponentProps } from '@reach/router';

class Hello extends React.Component<RouteComponentProps> {
  componentDidMount() {
    console.log('mount');
  }
  render() {
    return <h1 className="hello">hello world</h1>;
  }
}

export default Hello;
