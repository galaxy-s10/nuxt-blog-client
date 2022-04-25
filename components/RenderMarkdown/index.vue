<template>
  <div>
    <v-md-preview :text="md"></v-md-preview>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Vue from 'vue'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import hljs from 'highlight.js'
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
  mounted() {
    console.log(this.md, 22222)
  },
  created() {},
  methods: {},
}
</script>

<style>
.github-markdown-body {
  padding: 0px;
}
</style>
<style lang="scss" scoped></style>
