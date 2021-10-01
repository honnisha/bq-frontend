<template>

  <el-affix :offset="0">
    <div class="menu-buttons">
      <el-button size="mini" @click="useDarkTheme" class="menu-button"><i class="el-icon-view el-icon--right"></i> {{ $t('use-dark-theme') }}</el-button>
    </div>
  </el-affix>

  <v-ace-editor
    v-model:value="text"
    lang="yaml"
    :theme="$root.settings.dark ? 'ambiance' : 'chrome'"
    :class="customClass"
    :printMargin="false"
    :wrap="true"
    @change="textUpdate"
  />

</template>

<script>
import yaml from 'js-yaml'
import ace from 'ace-builds';
ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds/src-noconflict/")
import { VAceEditor } from 'vue3-ace-editor'

export default {
  props: ['modelValue', 'class'],
  components: {
    VAceEditor,
  },
  data() {
    return {
      text: '',
      customClass: this.class || 'yaml-editor'
    }
  },
  created() {
    try {
      this.text = yaml.dump(this.modelValue, this.$root.jsonOptions)
    } catch (e) {
      console.error('Yaml error:', e.message)
      this.$message({ type: 'error', message: `'Yaml error: ${e.message}` })
    }
  },
  methods: {
    textUpdate(event, text) {
      try {
        this.$emit('update:modelValue', yaml.load(this.text, this.$root.jsonOptions))
      } catch (e) {
        console.error('Yaml error:', e.message)
        this.$message({ type: 'error', message: `'Yaml error: ${e.message}` })
      }
    },
    useDarkTheme() {
      this.$root.settings.dark = !this.$root.settings.dark
      this.$root.settings = this.$root.settings
    },
  }
}
</script>
