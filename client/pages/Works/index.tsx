import * as React from 'react';
import Box from 'components/BoxContainer';
import { debounce } from 'lodash';
import Slider from 'react-slick';
import './index.less';

function NextArrow(props: any) {
  const { onClick } = props;
  return <div className={'right-btn'} onClick={onClick} />;
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return <div className={'left-btn'} onClick={onClick} />;
}

class Works extends React.PureComponent {
  state = {
    clickId: '',
    showWorkDetail: false
  };

  componentDidMount() {
    this.worksContent.style.transform = `translateX(${10 +
      ((window.innerWidth - 360) % 220) / 2}px)`;
    this.worksContent.style.visibility = 'visible';
    this.resizeListener = window.addEventListener(
      'resize',
      debounce(this.centerResize)
    );
  }

  centerResize = () => {
    this.worksContent.style.transform = `translateX(${10 +
      (window.innerWidth % 180) / 2}px)`;
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener);
  }

  works = [
    {
      id: 'youshu',
      iconUrl:
        'https://hustunique.com/static/src/pic/workspage/havebook%20-%20Assistor.png',
      name: '有书',
      imgUrl: 'https://hustunique.com/static/src/pic/workspage/youshu.jpg',
      description:
        '“有书”是一款校园图书馆借阅信息管理应用，提供Android、iOS客户端。产品定位校园，旨在帮助用户快速找到所需书籍，并对图书馆借阅信息进行管理。'
    },
    {
      id: 'helper',
      iconUrl:
        'https://hustunique.com/static/src/pic/workspage/helper%20-%20Assistor.png',
      name: '帮帮',
      imgUrl: 'https://hustunique.com/static/src/pic/workspage/youshu.jpg'
    }
  ];

  renderWorkDetail(id) {
    let startIdx = 0;

    this.works.forEach((work, idx) => {
      if (work.id === id) {
        startIdx = idx;
      }
    });

    const settings = {
      fade: true,
      speed: 1000,
      initialSlide: startIdx,
      arrows: true,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />
    };

    return (
      <Box width="940px" height="420px" className="work-slider-container">
        <Slider {...settings}>
          {this.works.map(work => {
            return (
              <div className="work-container" key={work.id}>
                <div className="work-img">
                  <img src={work.imgUrl} />
                </div>
                <div className="work-detail">
                  <div className="work-name">{work.name}</div>
                  <div className="work-description">{work.description}</div>
                </div>
              </div>
            );
          })}
        </Slider>
      </Box>
    );
  }

  render() {
    const { clickId, showWorkDetail } = this.state;
    return (
      <div className="works-container">
        <div className="works-title">作品</div>
        <div
          style={{ visibility: 'hidden' }}
          className="works-content"
          ref={c => (this.worksContent = c)}
        >
          {!showWorkDetail &&
            this.works.map(work => {
              return (
                <Box
                  width="200"
                  height="200"
                  className="works-item-container"
                  key={work.id}
                >
                  <div
                    className="works-item"
                    onClick={() => {
                      this.setState({
                        clickId: work.id,
                        showWorkDetail: true
                      });
                    }}
                  >
                    <img className="works-item-img" src={work.iconUrl} />
                    <div className="works-item-name">{work.name}</div>
                  </div>
                </Box>
              );
            })}
        </div>
        {showWorkDetail && this.renderWorkDetail(clickId)}
      </div>
    );
  }
}

export default Works;
