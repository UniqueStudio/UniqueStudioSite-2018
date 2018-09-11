import * as React from 'react';
import { RouteComponentProps } from '@reach/router';

interface State {
  cur: number;
}

class Increment extends React.Component<RouteComponentProps> {
  state = {
    cur: 0
  };

  clickHandler = () => {
    this.setState((pre: State) => ({
      cur: pre.cur + 1
    }));
  };

  render() {
    return <button onClick={this.clickHandler}>{this.state.cur}</button>;
  }
}

export default Increment;
