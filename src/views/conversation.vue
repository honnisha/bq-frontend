<template>

  <div class="view-editor-section dialog-section" v-if="!editMode">
    <el-affix :offset="0">
      <div class="menu-buttons">
        <el-button size="mini" @click="changeToYaml" class="menu-button"><i class="el-icon-document el-icon--right"></i> {{ $t('yaml-editor') }}</el-button>
        <el-button size="mini" @click="changeToDiagram" class="menu-button"><i class="el-icon-data-line el-icon--right"></i> {{ $t('diagram-editor') }}</el-button>
      </div>
    </el-affix>

    <el-card class="conversation-settings">
      <div class="conversation-settings-sction">
        <div class="conversation-setting-title">{{ $t('quester-name') }}:</div>
        <langHeader @newLang="newQuesterNameLang" />
        <langField v-model="dialogSectionInfo.quester" :span-left="8" :span-right="20"/>
      </div>
      <div class="conversation-settings-separator"></div>

      <div class="conversation-settings-sction">
        <div class="conversation-setting-title">{{ $t('first-option') }}:</div>
        <tagComplete
          v-model="dialogSectionInfo.first"
          type="pointers"
          dialogType="player_options"
          :section-info="projectData[subSectionName]"
          :dialog-section-name="dialogSectionName"
          :placeholder="$t('select-option')"
          :max="1"
        />
      </div>

      <div class="conversation-settings-sction">
        <div class="conversation-setting-title">{{ $t('stop-option') }}:</div>
        <el-checkbox v-model="dialogSectionInfo.stop"></el-checkbox><br/>
      </div>
    </el-card>

    <div class="dialog-options-section" v-for="dialogType in ['NPC_options', 'player_options']">
      <div class="menu-buttons">
        <div class="dialog-title">{{ $t(dialogType) }}</div>
        <el-button size="mini" @click="addDialogOption(dialogType)" class="menu-button" type="success" plain icon="el-icon-chat-line-round">{{ $t('add-dialog') }}</el-button>
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
    <el-affix :offset="0">
      <div class="menu-buttons">
        <el-button size="mini" @click="changeFromYamlToEditor" class="menu-button"><i class="el-icon-chat-line-square el-icon--right"></i> {{ $t('save-and-return') }}</el-button>
        <el-button size="mini" @click="useDarkTheme" class="menu-button"><i class="el-icon-view el-icon--right"></i> {{ $t('use-dark-theme') }}</el-button>
      </div>
    </el-affix>

    <aceEditor v-model="this.dialogSectionInfo" class="yaml-conversation yaml-editor"/>
  </div>

  <div class="yaml-editor-section" v-else-if="editMode === 'diagram'">
    <el-affix :offset="0">
      <div class="menu-buttons">
        <el-button size="mini" @click="changeFromDiagramToEditor" class="menu-button"><i class="el-icon-chat-line-square el-icon--right"></i> {{ $t('save-and-return') }}</el-button>
      </div>
    </el-affix>

    <diagramEdit :init-data="modelValue" />
  </div>

</template>

<script>
import dialogOption from "../components/dialogOption.vue"
import diagramEdit from "./diagram.vue"
import langField from "../components/langField.vue"
import langHeader from "../components/langHeader.vue";
import tagComplete from "../components/tagComplete.vue"
import aceEditor from "../components/aceEditor.vue"


export default {
  components: {
    dialogOption,
    diagramEdit,
    langField,
    langHeader,
    tagComplete,
    aceEditor,
  },
  props: ['modelValue', 'projectData', 'dialogSectionName', 'subSectionName'],
  data() {
    return {
      editMode: null,
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
      this.editMode = 'yaml'
    },
    changeFromYamlToEditor() {
      this.editMode = null
    },
    useDarkTheme() {
      this.$root.settings.dark = !this.$root.settings.dark
      this.$root.settings = this.$root.settings
    },
    changeFromDiagramToEditor() {
      this.editMode = null
    },
    addDialogOption(dialogType) {
      let initString = 'message_'
      if (dialogType === 'player_options') initString = 'option_'

      this.$prompt(this.$t('enter-dialog-name'), this.$t('dialog-window-title'), {
        confirmButtonText: this.$t('create'),
        cancelButtonText: this.$t('cancel'),
        inputPattern: /^[a-z0-9_]+$/,
        inputErrorMessage: this.$t('exists-regex'),
        inputValidator: value => !this.dialogSectionInfo[dialogType][value],
        closeOnClickModal: false,
        inputValue: initString,
      }).then(({ value }) => {
        const lang = { text: {} }
        lang.text[this.$root.settings.language] = ''
        this.dialogSectionInfo[dialogType][value] = lang

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
