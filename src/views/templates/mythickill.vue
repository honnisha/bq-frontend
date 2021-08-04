<template>
  123
</template>

<script>

export default {
  props: ['modelValue'],
  data() {
    return {
    }
  },
  computed: {
    localValue: {
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
