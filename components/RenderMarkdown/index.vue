<template>
  <div class="markdown-body" v-html="content"></div>
</template>

<script>
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import '@/assets/css/github-markdown.min.css'
export default {
  props: ['md'],
  data() {
    return {
      content: '',
    }
  },
  computed: {},
  watch: {
    md() {
      this.initMarked()
    },
  },
  created() {
    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight(code) {
        return hljs.highlightAuto(code).value
      },
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false,
    })
    this.initMarked()
  },
  methods: {
    initMarked() {
      marked.setOptions({
        renderer: new marked.Renderer(),
        highlight(code) {
          return hljs.highlightAuto(code).value
        },
        pedantic: false,
        gfm: true,
        tables: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false,
      })
      this.content = marked(this.md)
    },
    // // 格式化内容
    // newcontent(x) {
    //   marked.setOptions({
    //     renderer: new marked.Renderer(),
    //     highlight(code) {
    //       return hljs.highlightAuto(code).value
    //     },
    //     pedantic: false,
    //     gfm: true,
    //     tables: true,
    //     breaks: false,
    //     sanitize: false,
    //     smartLists: true,
    //     smartypants: false,
    //     xhtml: false,
    //   })
    //   return marked(x)
    // },
  },
}
</script>

<style lang="scss" scoped></style>
