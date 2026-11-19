// babel-preset-taro 更多选项和默认值：
// https://docs.taro.zone/docs/next/babel-config
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true,
      compiler: 'webpack5',
      // WeChat's Preview and Upload parse the package with an older JS parser (no `?.`, no `??`), and older phones
      // run older engines; Taro's own WeChat targets compile those away. The browser build keeps package.json's browserslist.
      ...(process.env.TARO_ENV === 'weapp' ? { targets: { ios: '9', android: '5' } } : {}),
    }]
  ]
}
