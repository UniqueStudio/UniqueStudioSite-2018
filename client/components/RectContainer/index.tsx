import * as React from 'react';
import './index.less';

interface RectangleProps {
  width: number;
  height: number;
  children: React.ComponentType;
}

class Rectangle extends React.PureComponent<RectangleProps> {
  render() {
    return <div className="">{this.props.children}</div>;
  }
}

export default Rectangle;
