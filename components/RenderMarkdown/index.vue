<template>
  <div class="render-markdown-wrap">
    <v-md-preview :text="md"></v-md-preview>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Vue from 'vue'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import bash from 'highlight.js/lib/languages/bash'
import '@kangc/v-md-editor/lib/style/preview.css'
import '@kangc/v-md-editor/lib/theme/style/github.css'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('bash', bash)

VMdPreview.use(githubTheme, {
  Hljs: hljs,
})
Vue.use(VMdPreview)

export default {
  components: { VMdPreview },
  props: ['md'],
  data() {
    return {}
  },
  computed: {
    ...mapState({
      theme(state) {
        return state.app.theme
      },
    }),
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {},
}
</script>

<style></style>
<style lang="scss" scoped>
.render-markdown-wrap {
  ::v-deep .github-markdown-body {
    padding: 0px;
    blockquote {
      margin-left: 0;
      margin-right: 0;
    }
  }
  ::v-deep .github-markdown-body > :last-child {
    margin-bottom: 0 !important;
  }
}
</style>
