declare module '*.(less|css)' {
  const content: any;
  export default content;
}

declare module '*.(svg|jpe?g|gif|png)' {
  const content: any;
  export default content;
}

declare module 'react-loadable';
