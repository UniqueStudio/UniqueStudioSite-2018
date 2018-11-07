import Loadable from 'react-loadable';
import Loading from 'components/Loading';

export default [
  {
    id: 'home',
    path: '/',
    name: '首页',
    Component: Loadable({
      loader: () => import(/* webpackChunkName: "home" */ 'pages/home'),
      loading: Loading,
      delay: 400
    })
  },
  {
    id: 'teams',
    name: '组别',
    path: '/teams',
    Component: Loadable({
      loader: () => import(/* webpackChunkName: "teams" */ 'pages/teams'),
      loading: Loading,
      delay: 400
    })
  },
  {
    id: 'datebook',
    name: '大事记',
    path: '/datebook',
    Component: Loadable({
      loader: () => import(/* webpackChunkName: "datebook" */ 'pages/datebook'),
      loading: Loading,
      delay: 400
    })
  },
  {
    id: 'works',
    name: '作品',
    path: '/works',
    Component: Loadable({
      loader: () => import(/* webpackChunkName: "works" */ 'pages/works'),
      loading: Loading,
      delay: 400
    })
  }
];
