<template>
  
  <v-ace-editor
    v-model:value="text"
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
import yaml from 'js-yaml'
import ace from 'ace-builds';
ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds/src-noconflict/")
import { VAceEditor } from 'vue3-ace-editor'

export default {
  props: ['modelValue', 'class', 'raw', 'readonly'],
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
    if (!this.raw) {
      try {
        this.text = yaml.dump(this.modelValue, this.$root.jsonOptions)
      } catch (e) {
        console.error('Yaml error:', e.message)
        this.$message({ type: 'error', message: `'Yaml error: ${e.message}` })
      }
    } else {
      this.text = this.modelValue
    }
  },
  methods: {
    textUpdate(event, text) {
      if (!this.raw) {
        try {
          this.$emit('update:modelValue', yaml.load(this.text, this.$root.jsonOptions))
        } catch (e) {
          console.error('Yaml error:', e.message)
          this.$message({ type: 'error', message: `'Yaml error: ${e.message}` })
        }
      } else {
        this.$emit('update:modelValue', this.text)
      }
    },
    useDarkTheme() {
      this.$root.settings.dark = !this.$root.settings.dark
      this.$root.settings = this.$root.settings
    },
  }
}
</script>
