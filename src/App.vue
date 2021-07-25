<template>
  <section class="el-container is-vertical">
    <input
      type="file"
      style="display: none"
      ref="fileInput"
      accept=".zip,"
      @change="onFilePicked"
    />

    <header class="el-header header-section">
      <el-button size="mini" @click="openArchive">Open Project zip</el-button>

      <el-button size="mini">Save Project as zip</el-button>
      <el-button size="mini" @click="openNewTabDialog">New section</el-button>
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
        <questSection :section-info="sectionInfo" />
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
      sections: [],
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

      this.sections.push({
        name: this.newTabName,
      })
      this.sectionSelected = this.newTabName
      this.newTabName = null
      this.dialogAddSectionVisible = false
      this.newTabNameError = null
    },
    openNewTabDialog() {
      this.newTabName = ''
      this.dialogAddSectionVisible = true
    },
    removeTab() {
      
    },
    openArchive() {
      this.$refs.fileInput.click()
    },
    async onFilePicked(event) {
      const files = event.target.files
      this.projectData = {}
      await loadArchive(files[0], this.projectData)
    }
  },
}
</script>
