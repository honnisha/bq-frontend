<template>
  <el-tabs tab-position="left" v-model="templateTabSelected" class="template-tabs" editable @tab-add="addNewTemplateDialog" @tab-remove="removeTab">
    <el-tab-pane :label="templateInfo.label" :name="templateInfo.label" :key="templateInfo.label" v-for="(templateInfo, templateKey) in templates" lazy>
      <templateComponent v-model="projectData" :source-yaml="templateInfo.yaml" @close="closeTemplate" @changeSource="newSource => changeSource(templateKey, newSource)" />
    </el-tab-pane>
  </el-tabs>

  <el-dialog
    :title="$t('template-create-new')"
    v-model="templateDialogVisible"
    width="30%"
  >
    <el-alert v-if="newDialogError" :title="newDialogError" type="error"/>

    <div class="dialog-subsection">
      <span>{{ $t('new-template-title') }}</span>
      <el-input v-model="newTemplate.title"></el-input><br/><br/>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="templateDialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="addNewTemplate">{{ $t('template-create-button') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import yaml from 'js-yaml'
import templateComponent from "../components/templateComponent.vue";

import bringItem from '../assets/templates-data/bringItem.yml?raw'
import moveTo from '../assets/templates-data/moveTo.yml?raw'
import objective from '../assets/templates-data/objective.yml?raw'
import dailyObjective from '../assets/templates-data/daily-objective.yml?raw'

export default {
  components: {
    templateComponent,
  },
  emits: ['close'],
  props: ['modelValue'],
  data() {
    return {
      templateTabSelected: null,
      templatesYamls: {
        'objective': objective,
        'bringItem': bringItem,
        'moveTo': moveTo,
        'dailyObjective': dailyObjective,
      },
      templates: {},
      templateDialogVisible: false,
      newTemplate: {title: ''},
      newDialogError: null,
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
    this.templates = this.loadTemplates()
    if (Object.keys(this.templates).length === 0) {
      this.templates = this.loadDefaultTemplates()
      this.saveTemplates(this.templates)
    }
    this.templateTabSelected = Object.keys(this.templates)[0].label
  },
  methods: {
    closeTemplate() {
      this.$emit('close')
    },
    addNewTemplate() {
      this.newDialogError = false
      if (!this.newTemplate.title.match(/^[a-z0-9_]+$/)) {
        this.newDialogError = this.$t('template-bad-name')
      }

      let templateData = {
        template_info: {
          title: {},
          variables: {
            LANGSLUG: {
              title: {
                en: 'Language',
                ru: 'Язык',
              },
              'default': 'en',
            },
            QUESTNAME: {
              title: {
                en: 'Quest name for system',
                ru: 'Название квеста для системы',
              },
              'default': 'example',
            }
          },
          settings: {
            secondNpc: false,
          }
        }
      }
      templateData.template_info.title[this.$root.settings.language] = this.newTemplate.title
      const sourceYaml = yaml.dump(templateData)

      this.templates[this.newTemplate.title] = { label: this.newTemplate.title, yaml: sourceYaml }
      console.log(this.templates)

      this.saveTemplates(this.templates)
      this.templateTabSelected = this.newTemplate.title
      this.$message({
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: this.$t('template-created').replace('{template}', this.newTemplate.title)
      });
      this.templateDialogVisible = false
    },
    addNewTemplateDialog() {
      this.templateDialogVisible = true
      this.newTemplate = {title: ''}
    },
    removeTab(label) {
      delete this.templates[label]
      this.saveTemplates(this.templates)
      this.$message({
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: this.$t('template-removed').replace('{template}', label)
      });
    },
    changeSource(label, newSource) {
      this.templates[label].yaml = newSource
      this.saveTemplates(this.templates)
      this.$message({
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: this.$t('template-saved'),
      })
    },
    loadDefaultTemplates() {
      let defaultTemplates = {}
      for (const [key, sourceYaml] of Object.entries(this.templatesYamls)) {
        try {
          const sourceJson = yaml.load(sourceYaml)
          const templateInfo = sourceJson['template_info']
          defaultTemplates[key] = { label: templateInfo.title[this.$root.settings.language], yaml: sourceYaml }

        } catch (e) {
          let error = e
          if (e.name === 'YAMLException') {
            error = e.message
          }
          console.error('Error with load template:', error)
        }
      }
      return defaultTemplates
    },
    loadTemplates() {
      return JSON.parse(localStorage.getItem(`templates`)) || {}
    },
    saveTemplates(templates) {
      localStorage.setItem(`templates`, JSON.stringify(templates));
    }
  }
}
</script>
