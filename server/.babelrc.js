module.exports = api => {
  api.env();
  return {
    presets: [
      [
        '@babel/env',
        {
          targets: {
            node: 'current'
          }
        }
      ],
      '@babel/react',
      '@babel/typescript'
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      '@babel/plugin-proposal-class-properties'
    ]
  };
};
