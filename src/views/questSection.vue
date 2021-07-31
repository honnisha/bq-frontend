<template>
  <el-tabs tab-position="left" class="section-tabs">

    <el-tab-pane label="Dialogues">
      <div class="menu-buttons">
        <el-button size="mini" @click="openNew('dialog')" class="menu-button">Add dialog section</el-button>
      </div>

      <div class="dialogs-tabs">
        <el-tabs tab-position="left" v-model="dialogSelected">
          <el-tab-pane :label="name" :name="name" v-for="(dialogInfo, name) in sectionInfo.conversations">
            <dialogueSection v-model="sectionInfo.conversations[name]" :project-data="projectData"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-tab-pane>

    <el-tab-pane label="Menus">
      <div class="menu-buttons">
        <el-button size="mini" @click="openNew('menu')" class="menu-button">Add menu</el-button>
      </div>

      <div class="dialogs-tabs">
        <el-tabs tab-position="left" v-model="menuSelected">
          <el-tab-pane :label="name" :name="name" v-for="(menuInfo, name) in sectionInfo.menus">
            <yamlEditor v-model="sectionInfo.menus[name]"/>
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
    v-model="addVisible"
    width="30%"
    custom-class="create-section-dialog"
  >
    <el-alert v-if="newNameError" :title="newNameError" type="error"/>
    <span>Provide name</span>
    <el-input placeholder="Quest dialog name" v-model="newName"></el-input>
    <el-checkbox v-model="includeExample">Include example</el-checkbox>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addDialoge">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import yaml from 'js-yaml'
import dialogueSection from "./sections/dialogueSection.vue";
import simpleSection from "./sections/simpleSection.vue";
import yamlEditor from "./sections/yamlEditor.vue";

import dialogExample from '../assets/dialogExample.yml?raw'
import menuExample from '../assets/menuExample.yml?raw'

export default {
  components: {
    dialogueSection,
    simpleSection,
    yamlEditor,
  },
  props: ['sectionInfo', 'projectData'],
  data() {
    return {
      addVisible: false,
      newNameError: null,
      newName: '',
      dialogSelected: null,
      menuSelected: null,
      newMode: null,
      includeExample: false,
    }
  },
  methods: {
    addDialoge() {
      if (this.newName.length <= 0) {
        this.newNameError = 'Title cannot be empty'
        return
      }

      if (!this.sectionInfo.conversations) this.sectionInfo.conversations = {}

      if (this.newMode === 'dialog') {
        if (!this.sectionInfo.conversations) this.sectionInfo.conversations = {}

        if (this.sectionInfo.conversations[this.newName]) {
          this.newNameError = `Dialog ${this.newName} already exisis`
          return
        }

        if (this.includeExample) {
          this.sectionInfo.conversations[this.newName] = yaml.load(dialogExample)
          this.sectionInfo.conversations[this.newName].quester = this.newName
        } else {
          this.sectionInfo.conversations[this.newName] = {
            quester: this.newName,
            NPC_options: {},
            player_options: {},
          } 
        }
        this.$message({
          type: 'success',
          message: `Dialog section ${this.newName} created`
        })

      } else if (this.newMode === 'menu') {
        if (!this.sectionInfo.menus) this.sectionInfo.menus = {}

        if (this.sectionInfo.menus[this.newName]) {
          this.newNameError = `Menu ${this.newName} already exisis`
          return
        }

        if (this.includeExample) {
          this.sectionInfo.menus[this.newName] = yaml.load(menuExample)
        } else {
          if (!this.sectionInfo.menus) this.sectionInfo.menus = {}
          this.sectionInfo.menus[this.newName] = {}
        }
        
        this.$message({
          type: 'success',
          message: `Menu section ${this.newName} created`
        })
      }

      this.dialogSelected = this.newName
      this.newName = null
      this.includeExample = false
      this.addVisible = false
      this.newNameError = null
      this.newMode = null
    },
    openNew(mode) {
      this.includeExample = false
      this.newMode = mode
      this.newName = ''
      this.addVisible = true
    },
  }
}
</script>
