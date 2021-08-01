<template>

  <div class="view-editor-section dialog-section" v-if="!yamlEdit">
    <div class="menu-buttons">
      <el-button size="mini" @click="changeToYaml" class="menu-button">Yaml editor</el-button>
    </div>

    <div class="dialog-options-section" v-for="section in ['NPC_options', 'player_options']">
      <div class="menu-buttons">
        <div class="dialog-title">{{ section }}</div>
        <el-button size="mini" @click="addDialogOption(section)" class="menu-button" type="success">Add dialog option</el-button>
      </div>

      <el-space wrap class="dialogs-section">
        <template v-for="(ignore, dialogKey) in dialogSectionInfo[section]" :key="dialogKey">
          <dialogOption
            v-model="dialogSectionInfo[section][dialogKey]"
            :section="section"
            :dialogKey="dialogKey"
            :project-data="projectData"
            :dialog-section-info="dialogSectionInfo"
            @delete="deleteDialog"
            @rename="renameDialog"
          />
        </template>
      </el-space>
    </div>
  </div>
  
  <div class="yaml-editor-section" v-else>
    <div class="menu-buttons">
      <el-button size="mini" @click="changeToEditor" class="menu-button">Save and return visual editor</el-button>
    </div>

    <el-input
      class="yaml-editor"
      type="textarea"
      :autosize="{ minRows: 20, maxRows: 60}"
      v-model="yamlText"
    />
  </div>
</template>

<script>
import dialogOption from "../fields/dialogOption.vue"
import yaml from  'js-yaml'

export default {
  components: {
    dialogOption,
  },
  props: ['modelValue', 'projectData'],
  data() {
    return {
      yamlEdit: false,
      yamlText: null,
    }
  },
  computed: {
    dialogSectionInfo: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
  },
  methods: {
    changeToYaml() {
      this.yamlText = yaml.dump(this.dialogSectionInfo, {lineWidth: -1})
      this.yamlEdit = true
    },
    changeToEditor() {
      this.dialogSectionInfo = yaml.load(this.yamlText)
      this.yamlText = null
      this.yamlEdit = false
    },
    addDialogOption(section) {
      this.$prompt('Please dialog name', 'Dialog', {
        confirmButtonText: 'Create',
        cancelButtonText: 'Cancel',
        inputPattern: /^[a-zA-Z0-9_]+$/,
        inputErrorMessage: 'Already exists or bad name (use only a-z A-Z 0-9 and _)',
        inputValidator: value => !this.dialogSectionInfo[section][value],
        closeOnClickModal: false,
      }).then(({ value }) => {
        console.log(section)
        this.dialogSectionInfo[section][value] = { text: null }

        this.$message({
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: `Dialog <b>${value}</b> created`
        })
      })
    },
    renameDialog(section, dialogKey, newKey) {
      this.dialogSectionInfo[section][newKey] = this.dialogSectionInfo[section][dialogKey]
      delete this.dialogSectionInfo[section][dialogKey]

      this.$message({
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: `Dialog <b>${dialogKey}</b> renamed to ${newKey}`
      })
    },
    deleteDialog(section, dialogKey) {
      delete this.dialogSectionInfo[section][dialogKey]
      this.$message({
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: `Dialog <b>${dialogKey}</b> deleted`
      })
    },
  }
}
</script>
