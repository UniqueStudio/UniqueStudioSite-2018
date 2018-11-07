import * as React from 'react';

interface FooterItemProps {
  title: string | number;
  items: { key: string; value: any }[];
}

class FooterItem extends React.PureComponent<FooterItemProps> {
  render() {
    const { title, items } = this.props;

    return (
      <div className="footer-item">
        <h1 className="footer-item-title">{title}</h1>
        <ul className="footer-item-content">
          {items.map(({ key, value }) => {
            return <li key={key}>{value}</li>;
          })}
        </ul>
      </div>
    );
  }
}

export default FooterItem;
