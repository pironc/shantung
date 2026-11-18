import { defineConfig } from '@tarojs/cli'

export default defineConfig<'webpack5'>({
  projectName: 'shantung',
  date: '2026-11-18',
  designWidth: 750,
  deviceRatio: { 640: 2.34 / 2, 750: 1, 375: 2, 828: 1.81 / 2 },
  sourceRoot: 'src',
  // One folder per target so the weapp and h5 watchers can run side by side.
  outputRoot: `dist/${process.env.TARO_ENV}`,
  framework: 'react',
  compiler: 'webpack5',
  // Sizes come from the design tokens in CSS px; no px-to-rpx/rem rewriting, so both builds match the system.
  mini: {
    postcss: { pxtransform: { enable: false, config: {} } },
  },
  h5: {
    publicPath: '/',
    devServer: { host: '0.0.0.0', port: 3001 },
    postcss: { pxtransform: { enable: false, config: {} } },
  },
})
