<template>

  <v-ace-editor
    v-model:value="localValue"
    lang="yaml"
    theme="chrome"
    class="yaml-editor"
    :printMargin="false"
    :wrap="true"
  />

</template>

<script>
import yaml from 'js-yaml'
import ace from 'ace-builds';
ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds/src-noconflict/")
import { VAceEditor } from 'vue3-ace-editor'

export default {
  props: ['modelValue'],
  components: {
    VAceEditor,
  },
  data() {
    return {
    }
  },
  computed: {
    localValue: {
      get() {
        return yaml.dump(this.modelValue, {lineWidth: -1})
      },
      set(value) {
        this.$emit('update:modelValue', yaml.load(this.yamlText))
      }
    },
  },
  methods: {
  }
}
</script>
