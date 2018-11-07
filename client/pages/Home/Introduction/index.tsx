import * as React from 'react';
import Box from 'components/BoxContainer';
import Slider from 'react-slick';
import './index.less';

class Introduction extends React.Component {
  contentList = [
    '联创团队（Unique-Studio）创建于2000年6月。 团队秉承不断创新的核心精神，怀揣对技术的无限热忱，努力打造一个以技术为驱动，多元发展的精英学生组织。 团队立足信息技术，通过承担科研项目，参加科技大赛，孕育创新产品等形式激发队员的无限激情和潜能，并积极整合历届队员的优势和资源，共同创造团队和个人的未来不懈努力。',
    '作为一个以兴趣为主导、强调主动实践和自主创新，由学生自发组织、自我管理的学生团队，团队致力于为有潜力、肯努力、富有激情的学生构建一流的学习环境，引导他们快速成长。目前团队已经取得了优异的成绩成为华中科技大学大学生主动实践获得成功的典范之一。团队积极参加国际高水平的科技创新大赛，尤其是在微软创新杯(Imagine-Cup)全球学生大赛中，连续5年闯进总决赛并代表中国大学生在世界大学生科技竞赛的舞台上崭露头角。unique33近年来，团队大力推广校园极客文化，努力把创新活动与IT产业相结合。团队连续三年举办了Unique-Hack-Day校园黑客马拉松大赛，通过Unique-Hack-Day，连接起了当今最有想法的年轻人，努力让极客文化传播得更广。与此同时，团队成员在校期间努力创新，推出了众多产品。离校后，团队成员积极投身创业浪潮，成功孵化出了百纳信息技术有限公司等企业。联创团队着力打造新的联创平台，为把更多更好的学生带向自主创新之路而不懈努力。',
    '近年来，团队大力推广校园极客文化，努力把创新活动与IT产业相结合。团队连续三年举办了Unique-Hack-Day校园黑客马拉松大赛，通过Unique-Hack-Day，连接起了当今最有想法的年轻人，努力让极客文化传播得更广。与此同时，团队成员在校期间努力创新，推出了众多产品。离校后，团队成员积极投身创业浪潮，成功孵化出了百纳信息技术有限公司等企业。联创团队着力打造新的联创平台，为把更多更好的学生带向自主创新之路而不懈努力。'
  ];

  sliderSettings = {
    autoplay: true,
    autoplayspeed: 3000,
    infinite: true,
    dots: true,
    pauseOnDotsHover: true,
    arrows: false,
    customPaging: function() {
      return <div className="dot-item" />;
    }
  };

  render() {
    let key = 0;
    return (
      <Box width="80%" height="450px" className="intro-container">
        <div className="intro-title-container">
          <h1 className="intro-title">联创团队</h1>
        </div>
        <Slider {...this.sliderSettings}>
          {this.contentList.map(content => {
            return (
              <div className="intro-content" key={key++}>
                {content}
              </div>
            );
          })}
        </Slider>
      </Box>
    );
  }
}

export default Introduction;
