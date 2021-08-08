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
    :placeholder="placeholder"
    openDirection="top"
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
  props: ['modelValue', 'placeholder', 'type', 'sectionInfo', 'dialogType'],
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
  created() {
    if (this.sectionInfo === undefined) {
      console.error(`sectionInfo in tagComplete is undefined; type: ${this.type}`)
    }
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

      if (this.type === 'conditions') {
        if (!this.sectionInfo.conditions) {
          this.sectionInfo.conditions = {}
          return
        }

        for (const [key, value] of Object.entries(this.sectionInfo.conditions)) {
          this.options.push({value: key, label: key})
        }
      } else if (this.type === 'events') {
        if (!this.sectionInfo.events) {
          this.sectionInfo.events = {}
          return
        }

        for (const [key, value] of Object.entries(this.sectionInfo.events)) {
          this.options.push({value: key, label: key})
        }
      } else if (this.type === 'pointers') {
        if (!this.sectionInfo.conversations) {
          this.sectionInfo.conversations = { NPC_options: {}, player_options: {} }
          return
        }

        if (this.sectionInfo.conversations) {
          for (const [dialogSectionkey, dialogSection] of Object.entries(this.sectionInfo.conversations)) {
            if (this.dialogType === 'NPC_options') {

              for (const [dialogkey, dialogOption] of Object.entries(dialogSection.player_options)) {
                this.options.push({value: dialogkey, label: dialogkey})
              }

            } else if (this.dialogType === 'player_options') {

              for (const [dialogkey, dialogOption] of Object.entries(dialogSection.NPC_options)) {
                this.options.push({value: dialogkey, label: dialogkey})
              }

            }
          }
        }
      }
    },
  }
}
</script>
