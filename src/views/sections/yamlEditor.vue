<template>

  <el-input
    class="yaml-editor"
    type="textarea"
    :autosize="{ minRows: 20, maxRows: 60}"
    v-model="localValue"
  />

</template>

<script>
import yaml from 'js-yaml'

export default {
  props: ['modelValue'],
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
