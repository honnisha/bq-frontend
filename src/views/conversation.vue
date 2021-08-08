<template>

  <div class="view-editor-section dialog-section" v-if="!editMode">
    <div class="menu-buttons">
      <el-button size="mini" @click="changeToYaml" class="menu-button">{{ $t('yaml-editor') }}</el-button>
      <el-button size="mini" @click="changeToDiagram" class="menu-button">{{ $t('diagram-editor') }}</el-button>
    </div>

    <div class="quester-name">
      <div class="dialog-title">{{ $t('quester-name') }}</div>
      <el-card class="quester-lang">
        <langHeader @newLang="newQuesterNameLang" />
        <langField v-model="dialogSectionInfo.quester" :span-left="10" :span-right="14"/>
      </el-card>
    </div>
    
    <div class="dialog-options-section" v-for="dialogType in ['NPC_options', 'player_options']">
      <div class="menu-buttons">
        <div class="dialog-title">{{ $t(dialogType) }}</div>
        <el-button size="mini" @click="addDialogOption()" class="menu-button" type="success" plain icon="el-icon-chat-line-round">{{ $t('add-dialog') }}</el-button>
      </div>

      <el-space wrap class="dialogs-section">
        <template v-for="(ignore, dialogName) in dialogSectionInfo[dialogType]" :key="dialogType">
          <dialogOption
            v-model="dialogSectionInfo[dialogType][dialogName]"
            :dialog-name="dialogName"
            :dialog-type="dialogType"
            :project-data="projectData"
            :dialog-section-name="dialogSectionName"
            :dialog-section-info="dialogSectionInfo"
            :sub-section-name="subSectionName"
            @delete="deleteDialog"
            @rename="renameDialog"
          />
        </template>
      </el-space>
    </div>
  </div>
  
  <div class="yaml-editor-section" v-else-if="editMode === 'yaml'">
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

  <div class="yaml-editor-section" v-else-if="editMode === 'diagram'">
    <diagramEdit :init-data="modelValue" />
  </div>

</template>

<script>
import dialogOption from "../components/dialogOption.vue"
import diagramEdit from "./diagramView.vue"
import langField from "../components/langField.vue"
import langHeader from "../components/langHeader.vue";
import yaml from  'js-yaml'

export default {
  components: {
    dialogOption,
    diagramEdit,
    langField,
    langHeader,
  },
  props: ['modelValue', 'projectData', 'dialogSectionName', 'subSectionName'],
  data() {
    return {
      editMode: null,
      yamlText: null,
      diagramData: null,
    }
  },
  computed: {
    dialogSectionInfo: {
      get() {
        // Its contains quester, first, stop, NPC_options, player_options
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
  },
  methods: {
    changeToDiagram() {
      this.editMode = 'diagram'
    },
    changeToYaml() {
      this.yamlText = yaml.dump(this.dialogSectionInfo, {lineWidth: -1})
      this.editMode = 'yaml'
    },
    changeToEditor() {
      this.dialogSectionInfo = yaml.load(this.yamlText)
      this.yamlText = null
      this.editMode = null
    },
    addDialogOption() {
      this.$prompt(this.$t('enter-dialog-name'), this.$t('dialog-window-title'), {
        confirmButtonText: this.$t('create'),
        cancelButtonText: this.$t('cancel'),
        inputPattern: /^[a-z0-9_]+$/,
        inputErrorMessage: this.$t('exists-regex'),
        inputValidator: value => !this.dialogSectionInfo[this.dialogSectionName][value],
        closeOnClickModal: false,
      }).then(({ value }) => {
        const lang = { text: {} }
        lang.text[this.$root.settings.language] = ''
        this.dialogSectionInfo[this.dialogSectionName][value] = lang

        this.$message({
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: this.$t('dialog-created').replace('{value}', value),
        })
      })
    },
    renameDialog(dialogOldName, dialogType, newDialogName) {
      this.dialogSectionInfo[dialogType][newDialogName] = this.dialogSectionInfo[dialogType][dialogOldName]
      delete this.dialogSectionInfo[dialogType][dialogOldName]

      this.$message({
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: this.$t('dialog-renamed').replace('{old}', dialogOldName).replace('{new}', newDialogName),
      })
    },
    deleteDialog(dialogType, dialogName) {
      delete this.dialogSectionInfo[dialogType][dialogName]
      this.$message({
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: this.$t('dialog-deleted').replace('{dialogKey}', dialogName),
      })
    },
    newQuesterNameLang(newLang) {
      if (!this.dialogSectionInfo.quester) this.dialogSectionInfo.quester = {}
      this.dialogSectionInfo.quester[newLang] = ''
    }
  }
}
</script>
