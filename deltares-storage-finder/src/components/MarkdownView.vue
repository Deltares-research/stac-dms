<template>
  <div class="markdown-body" v-html="rendered" />
</template>

<script setup>
  import MarkdownIt from 'markdown-it'
  import { computed } from 'vue'

  const props = defineProps({
    source: { type: String, default: '' },
  })

  const md = new MarkdownIt({
    html: false,
    linkify: true,
    breaks: true,
  })

  const defaultLinkOpen = md.renderer.rules.link_open || ((tokens, idx, options, env, self) =>
    self.renderToken(tokens, idx, options))
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const t = tokens[idx]
    const targetIdx = t.attrIndex('target')
    if (targetIdx < 0) t.attrPush(['target', '_blank'])
    else t.attrs[targetIdx][1] = '_blank'
    t.attrPush(['rel', 'noopener noreferrer'])
    return defaultLinkOpen(tokens, idx, options, env, self)
  }

  const rendered = computed(() => md.render(props.source ?? ''))
</script>

<style scoped>
.markdown-body :where(h1,h2,h3){ margin: 0.5rem 0; }
.markdown-body p{ margin: 0.5rem 0; }
.markdown-body a{ text-decoration: underline; }
</style>
