import * as React from 'react';
import classnames from 'classnames';
import './index.less';

interface BoxProps {
  height?: number | string;
  width?: number | string;
  children: any;
  className?: string;
}

class BoxContainer extends React.PureComponent<BoxProps> {
  render() {
    const { height, width, children, className } = this.props;

    return (
      <div
        className={classnames('box-container', className)}
        style={{ height, width }}
      >
        {children}
      </div>
    );
  }
}

export default BoxContainer;
