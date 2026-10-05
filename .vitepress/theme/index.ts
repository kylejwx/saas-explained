import { h } from 'vue'
import { useData, type Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ViewMarkdown from './ViewMarkdown.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    const { frontmatter } = useData()

    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(ViewMarkdown),
      'page-bottom': () => h(ViewMarkdown),
      'layout-bottom': () => frontmatter.value.layout === 'home' ? h(ViewMarkdown) : null
    })
  }
} satisfies Theme
