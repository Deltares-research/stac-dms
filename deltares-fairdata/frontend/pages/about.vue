<template>
  <div class="pa-8">
    <v-container>
      <v-row justify="center">
        <v-col
          cols="12"
          md="10"
          lg="8"
        >
          <div
            v-if="renderedMarkdown"
            class="about-content"
            v-html="renderedMarkdown"
          />
          <div v-else>
            Loading...
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
  import MarkdownIt from 'markdown-it'
  import { computed } from 'vue'
  import { fetchMarkdownContent } from '~/requests/content.js'

  const md = new MarkdownIt({
    html: true,        // Enable HTML tags in source
    linkify: true,     // Autoconvert URL-like text to links
    breaks: true,      // Convert '\n' in paragraphs into <br>
  })

  // Fetch the markdown file
  const markdownContent = await fetchMarkdownContent('stars4water/about.md')

  // Render the markdown to HTML
  const renderedMarkdown = computed(() => 
    markdownContent ? md.render(markdownContent) : ''
  )
</script>