import Loadable from 'react-loadable';
import Loading from 'components/Loading';

const loadable = (loader: anyFunc) =>
  Loadable({
    loader,
    loading: Loading,
    delay: 400
  });

export default loadable;
