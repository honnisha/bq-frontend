<template>
  <Multiselect
    class="autocomplete"
    v-model="selectedTags"
    mode="tags"
    :searchable="true"
    :createTag="true"
    :minChars="1"
    :resolveOnLoad="true"
    :appendNewTag="true"
    :object="true"
    :options="this.options"
    :placeholder="placeholder"
    :max="max || -1"
    :canClear="false"
    openDirection="top"
    @change="tagsChange"
    ref="multiselect"
    :noOptionsText="$t('no-options')"
    :noResultsText="$t('no-results')"
  />
</template>

<style src="@vueform/multiselect/themes/default.css"></style>

<script>
import Multiselect from '@vueform/multiselect'

export default {
  components: {
    Multiselect,
  },
  props: ['modelValue', 'placeholder', 'type', 'dialogSectionName', 'dialogType', 'max', 'options'],
  data() {
    return {
      selectedTags: null,
    }
  },
  mounted() {
    if (this.modelValue) this.selectedTags = this.modelValue.split(',').map(value => { return { value: value.trim(), label: value.trim() } })
  },
  methods: {
    tagsChange(tags) {
      this.$emit('update:modelValue', tags.map(value => value.value).join(","))
    },
  }
}
</script>
