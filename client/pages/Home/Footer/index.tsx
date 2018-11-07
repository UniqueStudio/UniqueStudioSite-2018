import * as React from 'react';
import FooterItem from './FooterItem';
import './index.less';

class Footer extends React.Component {
  connectionItem = {
    title: '联系我们',
    items: [
      { key: 'area', value: '联系地址：中国湖北省武汉市洪山区' },
      { key: 'address', value: '珞瑜路1037号华中科技大学启明学院亮胜楼8楼' },
      { key: 'en-address', value: '8th-Floor, Building-LiangSheng,' },
      { key: 'en-area', value: '1037-Luoyu-Road, Wuhan, 430074, P.R.China' },
      {
        key: 'email',
        value: (
          <span>
            官方邮箱: <a href="mailto:hr@hustunique.com">hr@hustunique.com</a>
          </span>
        )
      }
    ]
  };

  followItem = {
    title: '关注我们',
    items: [
      { key: 'wx', value: '官方微信: uniquestudio' },
      { key: 'weibo', value: '官方微博: 华中科技大学联创团队' }
    ]
  };

  joinItem = {
    title: '加入我们',
    items: []
  };

  render() {
    return (
      <div className="footer-container">
        <FooterItem
          title={this.connectionItem.title}
          items={this.connectionItem.items}
        />
        <FooterItem
          title={this.followItem.title}
          items={this.followItem.items}
        />
        <FooterItem title={this.joinItem.title} items={this.joinItem.items} />
      </div>
    );
  }
}

export default Footer;
