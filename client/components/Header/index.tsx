import * as React from 'react';
import { Link } from '@reach/router';
import routes from 'routes/index';
import './index.less';

class Header extends React.PureComponent {
  isLinkActive = ({ isCurrent }: { isCurrent: boolean }) => {
    return (isCurrent ? { className: 'active' } : null) as any;
  };
  render() {
    return (
      <div className="header-container">
        <div className="header-wrapper">
          <img
            className="header-logo"
            src="https://hustunique.com/static/src/pic/homepage/uniquelogo.png"
            alt="UniqueStudio"
          />
          <nav className="header-nav">
            {routes.map(({ id, name, path }) => (
              <Link getProps={this.isLinkActive} key={id} to={path}>
                {name}
              </Link>
            ))}
            <a href="https://join.hustunique.com/">加入/联系</a>
          </nav>
        </div>
      </div>
    );
  }
}

export default Header;
