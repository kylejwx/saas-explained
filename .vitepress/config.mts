import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'SaaS Explained',
  description: 'A practical guide to understanding how SaaS works.',
  base: '/saas-explained/',
  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/saas-explained/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/saas-explained/favicon-32x32.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/saas-explained/apple-touch-icon.png' }]
  ],
  lastUpdated: true,
  rewrites: {
    'SaaS_Architecture_Reference.md': 'architecture.md',
    'ROADMAP_IDEAS.md': 'roadmap.md',
    'Replit_All_in_One_Case_Study.md': 'replit-case-study.md'
  },
  themeConfig: {
    nav: [
      { text: 'Start here', link: '/' },
      { text: 'Architecture reference', link: '/architecture' },
      { text: 'Azure', link: '/azure' },
      { text: 'Google Cloud', link: '/google-cloud' },
      { text: 'Replit case study', link: '/replit-case-study' },
      { text: 'Roadmap', link: '/roadmap' },
      { text: 'Changes & editions', link: '/versions' }
    ],
    sidebar: [
      {
        text: 'SaaS Explained',
        items: [
          { text: 'Start here', link: '/' },
          { text: 'Architecture reference', link: '/architecture' },
          { text: 'Build on Azure', link: '/azure' },
          { text: 'Build on Google Cloud', link: '/google-cloud' },
          { text: 'Replit case study', link: '/replit-case-study' },
          { text: 'Roadmap', link: '/roadmap' },
          { text: 'Changes & editions', link: '/versions' }
        ]
      }
    ],
    outline: {
      label: 'On this page',
      level: [2, 3]
    },
    aside: 'left',
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
