<template>
  
  <v-ace-editor
    v-model:value="textData"
    lang="yaml"
    :theme="$root.settings.dark ? 'ambiance' : 'chrome'"
    :class="customClass"
    :printMargin="false"
    :wrap="true"
    :readonly="readonly"
    @change="textUpdate"
  />

</template>

<script>
import { dumpYaml, loadYaml } from '../utils/yamlUtils.js'
import ace from 'ace-builds';
ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds/src-noconflict/")
import { VAceEditor } from 'vue3-ace-editor'

export default {
  props: ['modelValue', 'class', 'raw', 'readonly', 'text'],
  components: {
    VAceEditor,
  },
  data() {
    return {
      textData: '',
      customClass: this.class || 'yaml-editor'
    }
  },
  created() {
    if (!this.raw) {
      try {
        this.textData = dumpYaml(this.modelValue, this.$root.jsonDumpOptions)
      } catch (e) {
        console.error('Yaml error:', e.message)
        this.$message({ type: 'error', message: `'Yaml error: ${e.message}` })
      }
    } else {
      this.textData = this.modelValue || this.text
    }
  },
  methods: {
    textUpdate(event, newText) {
      if (!this.raw) {
        try {
          this.$emit('update:modelValue', loadYaml(this.textData, this.$root.jsonLoadOptions))
        } catch (e) {
          console.error('Yaml error:', e.message)
          this.$message({ type: 'error', message: `'Yaml error: ${e.message}` })
        }
      } else {
        this.$emit('update:modelValue', this.textData)
      }
    },
    useDarkTheme() {
      this.$root.settings.dark = !this.$root.settings.dark
      this.$root.settings = this.$root.settings
    },
  }
}
</script>
