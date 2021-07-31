<template>

  <div class="view-editor-section" v-if="!yamlEdit">
    <div class="menu-buttons">
      <el-button size="mini" @click="changeToYaml" class="menu-button">Yaml editor</el-button>
    </div>

    <div class="dialog-options-section" v-for="section in ['NPC_options', 'player_options']">
      <div class="menu-buttons">
        <div class="dialog-title">{{ section }}</div><el-button size="mini" @click="addDialogOption(section)" class="menu-button">Add dialog option</el-button>
      </div>

      <el-space wrap class="dialogs-section">
        <template v-for="(dialogInfo, dialogKey) in localValue[section]" :key="dialogKey">
          <dialogOption v-model="localValue[section][dialogKey]" :section="section" :dialogKey="dialogKey" :project-data="projectData"/>
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
    changeToYaml() {
      this.yamlText = yaml.dump(this.localValue, {lineWidth: -1})
      this.yamlEdit = true
    },
    changeToEditor() {
      this.localValue = yaml.load(this.yamlText)
      this.yamlText = null
      this.yamlEdit = false
    },
    addDialogOption(section) {
      this.$prompt('Please dialog name', 'Dialog', {
        confirmButtonText: 'Create',
        cancelButtonText: 'Cancel',
        inputPattern: /^[a-zA-Z0-9_]+$/,
        inputErrorMessage: 'Already exists or bad name (use only a-z A-Z 0-9 and _)',
        inputValidator: value => !this.localValue[section][value],
      }).then(({ value }) => {
        this.localValue[section][value] = { text: null }

        this.$message({
          type: 'success',
          message: `Dialog ${value} created`
        })
      })
    },
    renameDialog(section, dialogKey) {
      this.$prompt('Enter new name', 'Dialog', {
        confirmButtonText: 'Rename',
        cancelButtonText: 'Cancel',
        inputPattern: /^[a-zA-Z0-9_]+$/,
        inputErrorMessage: 'Already exists or bad name (use only a-z A-Z 0-9 and _)',
        inputValidator: value => !this.localValue[section][value],
        inputValue: dialogKey,
      }).then(({ value }) => {
        this.localValue[section][value] = this.localValue[section][dialogKey]
        delete this.localValue[section][dialogKey]

        this.$message({
          type: 'success',
          message: `Dialog ${dialogKey} renamed to ${value}`
        })
      })
    },
    deleteDialog(section, dialogKey) {
      this.$confirm(`Delete ${dialogKey} from ${section}?`, 'Delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      }).then(() => {
        delete this.localValue[section][dialogKey]
        this.$message({
          type: 'success',
          message: `Dialog ${dialogKey} deleted`
        })
      })
    },
  }
}
</script>
