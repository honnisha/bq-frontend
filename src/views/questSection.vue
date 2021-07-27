<template>
  <el-tabs tab-position="left" class="section-tabs">

    <el-tab-pane label="Dialogues">
      <div class="menu-buttons">
        <el-button size="mini" @click="openNewDialog" class="menu-button">Add dialoge</el-button>
      </div>

      <div class="dialogs-tabs">
        <el-tabs tab-position="left" v-model="dialogSelected">
          <el-tab-pane :label="name" :name="name" v-for="(dialogInfo, name) in sectionInfo.conversations">
            <dialogueSection v-model="sectionInfo.conversations[name]"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-tab-pane>

    <el-tab-pane label="Events"><simpleSection v-model="sectionInfo.events"/></el-tab-pane>
    <el-tab-pane label="Conditions"><simpleSection v-model="sectionInfo.conditions"/></el-tab-pane>
    <el-tab-pane label="Objectives"><simpleSection v-model="sectionInfo.objectives"/></el-tab-pane>
    <el-tab-pane label="Items"><simpleSection v-model="sectionInfo.items"/></el-tab-pane>
    <el-tab-pane label="Main"><yamlEditor v-model="sectionInfo.main"/></el-tab-pane>
    <el-tab-pane label="Journal"><yamlEditor v-model="sectionInfo.journal"/></el-tab-pane>
    <el-tab-pane label="Custom"><yamlEditor v-model="sectionInfo.custom"/></el-tab-pane>
  </el-tabs>

  <el-dialog
    title="Create dialog"
    v-model="dialogAddDialogVisible"
    width="30%"
    custom-class="create-section-dialog"
  >
    <el-alert v-if="newDialogNameError" :title="newDialogNameError" type="error"/>
    <span>Provide name</span>
    <el-input placeholder="Quest dialog name" v-model="newDialogName"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogAddDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addDialoge">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import dialogueSection from "./sections/dialogueSection.vue";
import simpleSection from "./sections/simpleSection.vue";
import yamlEditor from "./sections/yamlEditor.vue";

export default {
  components: {
    dialogueSection,
    simpleSection,
    yamlEditor,
  },
  props: ['sectionInfo'],
  data() {
    return {
      dialogAddDialogVisible: false,
      newDialogNameError: null,
      newDialogName: '',
      dialogSelected: null,
    }
  },
  methods: {
    addDialoge() {
      if (this.newDialogName.length <= 0) {
        this.newDialogName = 'Section title cannot be empty'
        return
      }

      if (!this.sectionInfo.conversations) this.sectionInfo.conversations = {}

      this.sectionInfo.conversations[this.newDialogName] = { "quester": this.newDialogName }

      this.dialogSelected = this.newDialogName
      this.newDialogName = null
      this.dialogAddDialogVisible = false
      this.newTabNameError = null
    },
    openNewDialog() {
      this.newDialogName = ''
      this.dialogAddDialogVisible = true
    },
  }
}
</script>
