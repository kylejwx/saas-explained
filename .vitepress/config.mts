import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'SaaS Explained',
  description: 'A practical guide to understanding how SaaS works.',
  base: '/saas-explained/',
  lastUpdated: true,
  rewrites: {
    'SaaS_Architecture_Reference.md': 'architecture.md'
  },
  themeConfig: {
    nav: [
      { text: 'Start here', link: '/' },
      { text: 'Architecture reference', link: '/architecture' },
      { text: 'Changes & editions', link: '/versions' }
    ],
    sidebar: [
      {
        text: 'SaaS Explained',
        items: [
          { text: 'Start here', link: '/' },
          { text: 'Architecture reference', link: '/architecture' },
          { text: 'Changes & editions', link: '/versions' }
        ]
      }
    ],
    outline: {
      label: 'On this page',
      level: [2, 3]
    },
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/kylejwx/saas-explained/edit/main/:path',
      text: 'Edit this page on GitHub'
    },
    footer: {
      message: 'Built to make SaaS architecture easier to understand.',
      copyright: 'Content by Kyle Wilcox'
    }
  }
})
