import * as React from 'react';
import Slider from 'react-slick';
import './index.less';

class Datebook extends React.PureComponent {
  eventsList = [
    {
      year: 2000,
      event: '华中科技大学机械学院98级的13名学生创立了联创工作室',
      imgUrl: 'https://hustunique.com/static/src/pic/eventspage/2000.jpg'
    },
    {
      year: 2004,
      event: '趋势科技全国百万程序大赛团体第四名',
      imgUrl: 'https://hustunique.com/static/src/pic/eventspage/2000.jpg'
    },
    {
      year: 2005,
      event: '微软创新杯office designer第三名',
      imgUrl: 'https://hustunique.com/static/src/pic/eventspage/2000.jpg'
    }
  ];

  sliderSettings = {
    dots: true,
    infinite: true,
    arrows: false,
    customPaging: (i:number) => {
      return (
        <div className="date-book-paging">
          <div className="paging-circle" />
          {this.eventsList[i].year}
        </div>
      );
    }
  };

  render() {
    let id = 0;
    return (
      <div className="date-book-container">
        <div className="date-book-title">大事记</div>
        <Slider {...this.sliderSettings}>
          {this.eventsList.map(event => {
            return (
              <div className="date-book-event" key={id++}>
                <img src={event.imgUrl} />
                <div className="date-book-text">
                  <h1>{event.year}</h1>
                  <p>{event.event}</p>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    );
  }
}

export default Datebook;
