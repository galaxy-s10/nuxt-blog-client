<template>
  <div class="render-markdown-wrap">
    <v-md-preview :text="md"></v-md-preview>
  </div>
</template>

<script>
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import Vue from 'vue';
import { mapState } from 'vuex';

import '@kangc/v-md-editor/lib/style/preview.css';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('bash', bash);

if (!Vue._is_use_VMdPreview) {
  VMdPreview.use(githubTheme, {
    Hljs: hljs,
  });
  VMdPreview.use(createTodoListPlugin()); // 任务列表
  VMdPreview.use(createCopyCodePlugin()); // 快捷复制代码
  Vue._is_use_VMdPreview = true;
}

export default {
  components: { VMdPreview },
  props: {
    md: {
      type: String,
      require: true,
      default: '',
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      theme(state) {
        return state.app.theme;
      },
    }),
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {},
};
</script>

<style></style>
<style lang="scss" scoped>
.render-markdown-wrap {
  :deep(.github-markdown-body) {
    // ::v-deep .github-markdown-body {
    padding: 0px;
    blockquote {
      margin-left: 0;
      margin-right: 0;
    }
  }
  :deep(.github-markdown-body > :last-child) {
    // ::v-deep .github-markdown-body > :last-child {
    margin-bottom: 0 !important;
  }
}
</style>
