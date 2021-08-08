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
    :options="async function(query) { return await getChoicesUpdate(query) }"
    @change="tagsChange"
    @open="openTags"
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
  props: ['modelValue', 'placeholder', 'projectData', 'section', 'type'],
  data() {
    return {
      selectedTags: null,
      options: [],
      optionsLoaded: false,
    }
  },
  mounted() {
    if (this.modelValue) this.selectedTags = this.modelValue.split(',').map(value => { return { value: value.trim(), label: value.trim() } })
  },
  methods: {
    openTags() {
      this.updateOptions()
    },
    tagsChange(tags) {
      this.$emit('update:modelValue', tags.map(value => value.value).join(","))
    },
    async getChoicesUpdate(searchString) {
      return this.options
    },
    updateOptions() {
      if (this.optionsLoaded) return
      this.optionsLoaded = true

      for (const [sectionName, section] of Object.entries(this.projectData)) {

        if (this.type === 'conditions') {
          if (!section.conditions) section.conditions = {}
          for (const [key, value] of Object.entries(section.conditions)) {
            const valueWithPrefix = `${sectionName}.${key}`
            this.options.push({value: valueWithPrefix, label: valueWithPrefix})
          }
        } else if (this.type === 'events') {
          if (!section.events) section.events = {}
          for (const [key, value] of Object.entries(section.events)) {
            const valueWithPrefix = `${sectionName}.${key}`
            this.options.push({value: valueWithPrefix, label: valueWithPrefix})
          }
        } else if (this.type === 'pointers') {
          if (!section.conversations) section.conversations = { NPC_options: {}, player_options: {} }

          if (section.conversations) {
            for (const [dialogSectionkey, dialogSection] of Object.entries(section.conversations)) {
              if (this.section === 'NPC_options') {

                for (const [dialogkey, dialogOption] of Object.entries(dialogSection.player_options)) {
                  const valueWithPrefix = `${sectionName}.${dialogkey}`
                  this.options.push({value: valueWithPrefix, label: valueWithPrefix})
                }

              } else if (this.section === 'player_options') {

                for (const [dialogkey, dialogOption] of Object.entries(dialogSection.NPC_options)) {
                  const valueWithPrefix = `${sectionName}.${dialogkey}`
                  this.options.push({value: valueWithPrefix, label: valueWithPrefix})
                }

              }
            }
          }
        }
      }
    },
  }
}
</script>
