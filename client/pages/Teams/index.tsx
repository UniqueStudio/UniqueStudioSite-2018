import * as React from 'react';
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

class Teams extends React.PureComponent {
  teams = [
    {
      name: 'DESIGN',
      description:
        'Design组主要进行各个平台软件、网页及WebApp的界面和交互设计，也会进行游戏设计和视频制作。我们并非美工而是设计师，在这里你可以做任何发挥艺术天赋，并借由技术和互联网闪耀光芒的设计。'
    },
    {
      name: 'WEB',
      description:
        'Design组主要进行各个平台软件、网页及WebApp的界面和交互设计，也会进行游戏设计和视频制作。我们并非美工而是设计师，在这里你可以做任何发挥艺术天赋，并借由技术和互联网闪耀光芒的设计。'
    },
    {
      name: 'PM',
      description:
        'Design组主要进行各个平台软件、网页及WebApp的界面和交互设计，也会进行游戏设计和视频制作。我们并非美工而是设计师，在这里你可以做任何发挥艺术天赋，并借由技术和互联网闪耀光芒的设计。'
    },
    {
      name: 'IOS',
      description:
        'Design组主要进行各个平台软件、网页及WebApp的界面和交互设计，也会进行游戏设计和视频制作。我们并非美工而是设计师，在这里你可以做任何发挥艺术天赋，并借由技术和互联网闪耀光芒的设计。'
    }
  ];

  sliderSettings = {
    autoplay: true,
    autoplayspeed: 3000,
    infinite: true,
    dots: false,
    pauseOnDotsHover: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  joinHandler() {
    window.location.href = 'https://join.hustunique.com/';
  }

  render() {
    return (
      <div className="teams-container">
        <div className="teams-wrapper">
          <Slider {...this.sliderSettings}>
            {this.teams.map(team => {
              return (
                <div key={team.name} className="team">
                  <h1 className="team-name">{team.name}</h1>
                  <div className="team-description">{team.description}</div>
                </div>
              );
            })}
          </Slider>
          <div onClick={this.joinHandler} className="team-join-btn">
            JOIN US
          </div>
        </div>
      </div>
    );
  }
}

export default Teams;
