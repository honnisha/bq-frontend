<template>

  <div class="view-editor-section dialog-section" v-if="!yamlEdit">
    <div class="menu-buttons">
      <el-button size="mini" @click="changeToYaml" class="menu-button">{{ $t('yaml-editor') }}</el-button>
    </div>

    <div class="quester-name">
      <div class="dialog-title">{{ $t('quester-name') }}</div>
      <el-card class="quester-lang">
        <langField v-model="dialogSectionInfo.quester" />
      </el-card>
    </div>
    
    <div class="dialog-options-section" v-for="section in ['NPC_options', 'player_options']">
      <div class="menu-buttons">
        <div class="dialog-title">{{ $t(section) }}</div>
        <el-button size="mini" @click="addDialogOption(section)" class="menu-button" type="success" plain icon="el-icon-chat-line-round">{{ $t('add-dialog') }}</el-button>
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
      <el-button size="mini" @click="changeToEditor" class="menu-button">{{ $t('save-and-return') }}</el-button>
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
import langField from "../fields/langField.vue"
import yaml from  'js-yaml'

export default {
  components: {
    dialogOption,
    langField,
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
      this.$prompt(this.$t('enter-dialog-name'), this.$t('dialog-window-title'), {
        confirmButtonText: this.$t('create'),
        cancelButtonText: this.$t('cancel'),
        inputPattern: /^[a-zA-Z0-9_]+$/,
        inputErrorMessage: this.$t('dialog-exists-regex'),
        inputValidator: value => !this.dialogSectionInfo[section][value],
        closeOnClickModal: false,
      }).then(({ value }) => {
        const lang = { text: {} }
        lang.text[this.$root.settings.language] = ''
        this.dialogSectionInfo[section][value] = lang

        this.$message({
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: this.$t('dialog-created').replace('{value}', value),
        })
      })
    },
    renameDialog(section, dialogKey, newKey) {
      this.dialogSectionInfo[section][newKey] = this.dialogSectionInfo[section][dialogKey]
      delete this.dialogSectionInfo[section][dialogKey]

      this.$message({
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: this.$t('dialog-created').replace('{dialogKey}', dialogKey).replace('{newKey}', newKey),
      })
    },
    deleteDialog(section, dialogKey) {
      delete this.dialogSectionInfo[section][dialogKey]
      this.$message({
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: this.$t('dialog-deleted').replace('{dialogKey}', dialogKey),
      })
    },
  }
}
</script>
