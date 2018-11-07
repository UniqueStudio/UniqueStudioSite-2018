import * as React from 'react';
import Introduction from './Introduction';
import Main from './Main';
import Footer from './Footer';
import City from 'components/City';

class Home extends React.PureComponent {
  render() {
    return (
      <>
        <City />
        <Main />
        <Introduction />
        <Footer />
      </>
    );
  }
}

export default Home;
