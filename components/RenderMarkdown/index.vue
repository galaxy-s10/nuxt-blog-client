<template>
  <div class="render-markdown-wrap">
    <v-md-preview :text="md"></v-md-preview>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import scss from 'highlight.js/lib/languages/scss'
import bash from 'highlight.js/lib/languages/bash'

import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'

import '@kangc/v-md-editor/lib/style/preview.css'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'

hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('bash', bash)

VMdPreview.use(githubTheme, {
  Hljs: hljs,
})

VMdPreview.use(createTodoListPlugin()) // 任务列表
VMdPreview.use(createCopyCodePlugin()) // 快捷复制代码

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
