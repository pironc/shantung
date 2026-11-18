import { theme } from './theme'

// Colours come from the design tokens via scripts/tokens.mjs: WeChat config cannot read CSS variables.
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/collection/index',
    'pages/salons/index',
    'pages/membership/index',
    'pages/product/index',
    'pages/story/index',
    'pages/appointment/index',
    'pages/checkin/index',
    'pages/salon/index',
    'pages/boutique/index',
  ],
  // The invitation card (canvas drawing and QR code) loads on demand, outside the 2 MB main package.
  subPackages: [{ root: 'packages/pass', pages: ['index'] }],
  window: {
    // Pages draw their own top: no title bar, a floating back button below the status bar (components/ui.tsx, TopBar).
    navigationStyle: 'custom',
    navigationBarBackgroundColor: theme.navBackground,
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'Shantung',
    backgroundColor: theme.navBackground,
  },
  tabBar: {
    color: theme.textSecondary,
    selectedColor: theme.accent,
    backgroundColor: theme.navBackground,
    borderStyle: 'white',
    list: [
      { pagePath: 'pages/index/index', text: 'Discover' },
      { pagePath: 'pages/collection/index', text: 'Collection' },
      { pagePath: 'pages/salons/index', text: 'Salons' },
      { pagePath: 'pages/membership/index', text: 'Membership' },
    ],
  },
})
