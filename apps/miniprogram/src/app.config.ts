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
  // Load each page's components when that page needs them, not all at launch (WeChat's code quality check).
  lazyCodeLoading: 'requiredComponents',
  window: {
    // Pages draw their own top: no title bar, a floating back button below the status bar (components/ui.tsx, TopBar).
    navigationStyle: 'custom',
    navigationBarBackgroundColor: theme.navBackground,
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'Shantung',
    backgroundColor: theme.navBackground,
  },
  tabBar: {
    color: theme.idle,
    selectedColor: theme.accent,
    backgroundColor: theme.navBackground,
    borderStyle: 'white',
    list: [
      // Line icons in the house construction, as PNG (WeChat's tabBar takes no SVG); sources beside them in assets/tab.
      { pagePath: 'pages/index/index', text: 'Discover', iconPath: 'assets/tab/discover.png', selectedIconPath: 'assets/tab/discover-on.png' },
      { pagePath: 'pages/collection/index', text: 'Collection', iconPath: 'assets/tab/collection.png', selectedIconPath: 'assets/tab/collection-on.png' },
      { pagePath: 'pages/salons/index', text: 'Salons', iconPath: 'assets/tab/salons.png', selectedIconPath: 'assets/tab/salons-on.png' },
      { pagePath: 'pages/membership/index', text: 'Membership', iconPath: 'assets/tab/membership.png', selectedIconPath: 'assets/tab/membership-on.png' },
    ],
  },
})
