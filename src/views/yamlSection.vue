<template>

  <aceEditor v-model="text" :class="class"/>

</template>

<script>
import aceEditor from "../components/aceEditor.vue"

export default {
  props: ['modelValue', 'class'],
  components: {
    aceEditor,
  },
  computed: {
    text: {
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
