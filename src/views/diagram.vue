<template>
  <div class="diagram-editor">
  </div>
</template>

<script>

export default {
  props: ['initData'],
  data() {
    return {
    }
  },
  computed: {
    questData: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
  },
  methods: {
  }
}
</script>
