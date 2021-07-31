<template>
  <section class="el-container is-vertical">
    <input
      type="file"
      style="display: none"
      ref="arciveFileInput"
      accept=".zip,"
      @change="onFileArchivePicked"
    />
    <input
      type="file"
      style="display: none"
      ref="jsonFileInput"
      accept=".json,"
      @change="onFileJsonPicked"
    />

    <header class="el-header header-section">

      <el-dropdown size="small">
        <el-button size="mini" class="header-buttons">
          Open<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="openArchive">Open Project zip</el-dropdown-item>
            <el-dropdown-item @click="openJson">Open Project json</el-dropdown-item>
            
            <el-dropdown-item @click="openLocalStorage(index)" v-for="index in 5" :key="index" :divided="index === 1">Open Project from local slot {{ index }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown size="small">
        <el-button size="mini" class="header-buttons">
          Save<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="saveAsJson">Save Project as json</el-dropdown-item>

            <el-dropdown-item @click="saveLocalStorage(index)" v-for="index in 5" :key="index" :divided="index === 1">Save Project to local slot {{ index }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button size="mini" @click="openNewTabDialog" class="header-buttons">New section</el-button>
    </header>

    <el-dialog
      title="Create section"
      v-model="dialogAddSectionVisible"
      width="30%"
      custom-class="create-section-dialog"
    >
      <el-alert v-if="newTabNameError" :title="newTabNameError" type="error"/>
      <span>Provide quest section name</span>
      <el-input placeholder="Quest section name" v-model="newTabName"></el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogAddSectionVisible = false">Cancel</el-button>
          <el-button type="primary" @click="addTab">Confirm</el-button>
        </span>
      </template>
    </el-dialog>

    <el-tabs v-model="sectionSelected" type="border-card" closable @tab-remove="removeTab">
      <el-tab-pane
        v-for="(sectionInfo, name) in projectData"
        :key="name"
        :label="name"
        :name="name"
      >
        <questSection :section-info="sectionInfo" :project-data="projectData" />
      </el-tab-pane>

    </el-tabs>
  </section>
</template>

<style lang="scss">
 @import "./src/styles/main.scss";
</style>

<script>
import { loadArchive } from './utils/archiveLoader.js'
import questSection from "./views/questSection.vue";

export default {
  components: {
    questSection,
  },
  data() {
    return {
      projectData: {},
      sectionSelected: null,
      dialogAddSectionVisible: false,
      newTabName: null,
      newTabNameError: null,
    }
  },
  methods: {
    addTab() {
      if (this.newTabName.length <= 0) {
        this.newTabNameError = 'Section title cannot be empty'
        return
      }

      this.projectData[this.newTabName] = {}

      this.sectionSelected = this.newTabName
      this.newTabName = null
      this.dialogAddSectionVisible = false
      this.newTabNameError = null
    },
    openNewTabDialog() {
      this.newTabName = ''
      this.dialogAddSectionVisible = true
    },
    removeTab(tab) {
      this.$confirm(`Delete section ${tab}?`, 'Confirm', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        delete this.projectData[tab]
        this.$message({
          type: 'success',
          message: `Tab ${tab} deleted`
        });
      })
    },
    openArchive() {
      this.$refs.arciveFileInput.click()
    },
    async onFileArchivePicked(event) {
      const files = event.target.files
      this.projectData = {}
      await loadArchive(files[0], this.projectData)
    },
    openJson() {
      this.$refs.jsonFileInput.click()
    },
    async onFileJsonPicked(event) {
      const files = event.target.files
      this.projectData = {}

      self = this
      var fileReader = new FileReader()
      fileReader.onload = function() {
        self.projectData = JSON.parse(fileReader.result)
      }
      fileReader.readAsText(files[0])
    },
    saveAsJson() {
      const data = JSON.stringify(this.projectData)
      const blob = new Blob([data], {type: 'text/plain'})
      const eElelent = document.createEvent('MouseEvents')
      const aElement = document.createElement('a')

      const date = JSON.stringify(new Date());
      aElement.download = `questdata${date}.json`

      aElement.href = window.URL.createObjectURL(blob)
      aElement.dataset.downloadurl = ['text/json', aElement.download, aElement.href].join(':')
      eElelent.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      aElement.dispatchEvent(eElelent)
    },
    openLocalStorage(index) {
      const data = JSON.parse(localStorage.getItem(`projects_${index}`))
      if (!data) {
        this.$message({message: `Project slot ${index} emty`, type: 'info'})
      } else {
        this.projectData = data
        this.$message({message: `Project loaded from ${index} slot`, type: 'success'})
      }
    },
    saveLocalStorage(index) {
      localStorage.setItem(`projects_${index}`, JSON.stringify(this.projectData));
      this.$message({message: `Project saved to ${index} slot`, type: 'success'})
    },
  }
}
</script>
