<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()
const markdownUrl = computed(() => {
  // filePath retains the original source path, including when a route is rewritten.
  const sourcePath = page.value.filePath
  if (page.value.isNotFound || !sourcePath?.endsWith('.md')) return null

  const encodedPath = sourcePath.split('/').map(encodeURIComponent).join('/')
  return `https://raw.githubusercontent.com/kylejwx/saas-explained/main/${encodedPath}`
})
</script>

<template>
  <div
    v-if="markdownUrl"
    class="view-markdown"
    :class="{ standalone: frontmatter.layout === 'home' || frontmatter.layout === 'page' }"
  >
    <a :href="markdownUrl">View Markdown</a>
  </div>
</template>

<style scoped>
.view-markdown {
  margin-top: 24px;
  font-size: 14px;
  line-height: 24px;
}

.view-markdown.standalone {
  margin: 24px auto;
  text-align: center;
}

.view-markdown a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.view-markdown a:hover {
  color: var(--vp-c-brand-2);
}
</style>
