<template>
  <el-tabs tab-position="left" v-model="templateTabSelected" class="template-tabs">
    <el-tab-pane :label="templateInfo.label" :name="templateInfo.label" :key="templateInfo.label" v-for="templateInfo in templates">
      <templateComponent v-model="projectData" :source-yaml="templateInfo.yaml" :sub-section-name="subSectionName" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import yaml from 'js-yaml'

import templateComponent from "../components/templateComponent.vue";

import bringItem from '../assets/templates-data/bringItem.yml?raw'
import moveTo from '../assets/templates-data/moveTo.yml?raw'
import objective from '../assets/templates-data/objective.yml?raw'

export default {
  components: {
    templateComponent,
  },
  props: ['modelValue', 'subSectionName'],
  data() {
    return {
      templateTabSelected: null,
      templatesYamls: [
        objective,
        bringItem,
        moveTo,
      ],
      templates: [],
    }
  },
  computed: {
    projectData: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
  },
  created() {
    for (const sourceYaml of this.templatesYamls) {
      try {
        const sourceJson = yaml.load(sourceYaml)
        console.log(sourceJson)
        const templateInfo = sourceJson['template_info']
        this.templates.push({ label: templateInfo.title[this.$root.settings.language], yaml: sourceYaml })

      } catch (e) {
        let error = e
        if (e.name === 'YAMLException') {
          error = e.message
        }
        console.error('Error with load template:', error)
      }
    }
    this.templateTabSelected = this.templates[0].label
  }
}
</script>
