<template>
  <Multiselect
    class="autocomplete"
    v-model="selectedTags"
    mode="tags"
    :searchable="true"
    :createTag="true"
    :minChars="1"
    :options="async function(query) { return await getChoicesUpdate(query) }"
    @change="tagsChange"
    ref="multiselect"
  />
</template>

<style src="@vueform/multiselect/themes/default.css"></style>

<script>
import Multiselect from '@vueform/multiselect'

export default {
  components: {
    Multiselect,
  },
  props: ['modelValue', 'placeholder', 'projectData'],
  data() {
    return {
      selectedTags: null,
    }
  },
  mounted() {
    if (this.modelValue) this.selectedTags = this.modelValue.split(',').map(value => value.trim())
  },
  methods: {
    tagsChange(tags) {
      this.$emit('update:modelValue', tags.join(","))
    },
    async getChoicesUpdate(searchString) {
      return [
        { value: 'batman', label: 'Batman' },
        { value: 'robin', label: 'Robin' },
        { value: 'joker', label: 'Joker' },
        { value: 'test', label: 'test' },
        { value: 'test2', label: 'test2' },
        { value: 'test23', label: 'test23' },
      ]
    },
  }
}
</script>
