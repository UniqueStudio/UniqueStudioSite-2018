module.exports = api => {
  const env = api.env();

  return {
    presets: [
      [
        '@babel/env',
        {
          targets: {
            browsers: ['last 2 versions']
          }
        }
      ],
      '@babel/react',
      '@babel/typescript'
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
      [
        'babel-plugin-module-resolver',
        {
          cwd: 'babelrc',
          extensions: ['.ts', '.tsx', '.js'],
          root: ['./']
        }
      ],
      'react-loadable/babel'
    ]
  };
};
