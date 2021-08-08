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
        <el-button size="mini" class="header-buttons" icon="el-icon-folder-opened">
          {{ $t('open') }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="openArchive">{{ $t('open-zip') }}</el-dropdown-item>
            <el-dropdown-item @click="openJson">{{ $t('open-json') }}</el-dropdown-item>
            
            <el-dropdown-item @click="openLocalStorage(index)" v-for="index in 5" :key="index" :divided="index === 1">{{ $t('open-slot') }} {{ index }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown size="small">
        <el-button size="mini" class="header-buttons" icon="el-icon-takeaway-box">
          {{ $t('save') }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="saveAsZip">{{ $t('save-zip') }}</el-dropdown-item>
            <el-dropdown-item @click="saveAsJson">{{ $t('save-json') }}</el-dropdown-item>

            <el-dropdown-item @click="saveLocalStorage(index)" v-for="index in 5" :key="index" :divided="index === 1">{{ $t('save-slot') }} {{ index }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button size="mini" @click="openNewTabDialog" class="header-buttons" icon="el-icon-folder-add">{{ $t('new-section') }}</el-button>
      <!-- <el-button size="mini" @click="openSettingsVisible = true" class="header-buttons" icon="el-icon-setting">{{ $t('settings') }}</el-button> -->
      <el-link type="primary" target="_blank" rel="noopener noreferrer" href="https://docs.betonquest.org/" class="header-buttons">{{ $t('bq-doc') }}</el-link>
      <el-link type="primary" target="_blank" rel="noopener noreferrer" href="https://github.com/BetonQuest/RPGMenu/wiki/" class="header-buttons">{{ $t('rpgmenu-doc') }}</el-link>

      <div class="right-header">

        <el-dropdown>
          <span class="el-dropdown-link">
            <component class="lang-icon" :is="avaliableLanguages[settings.language]"></component>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item class="lang-option" @click="changeLang(langSlug)" v-for="(flagIcon, langSlug) in avaliableLanguages"><component class="lang-icon" :is="flagIcon"></component></el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
      </div>
    </header>

    <el-dialog
      :title="$t('create-section')"
      v-model="dialogAddSectionVisible"
      width="30%"
      custom-class="dialog create-section"
    >
      <el-alert v-if="newTabNameError" :title="newTabNameError" type="error"/>
      <span>{{ $t('quest-name') }}</span>
      <el-input v-model="newTabName"></el-input><br/><br/>
      <el-checkbox v-model="inclideDialogExample">{{ $t('quest-example') }}</el-checkbox><br/>
      <el-checkbox v-model="inclideMenuExample">{{ $t('menu-example') }}</el-checkbox><br/>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogAddSectionVisible = false">{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="addTab">{{ $t('create') }}</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      :title="$t('settings')"
      v-model="openSettingsVisible"
      width="30%"
      custom-class="dialog setting-dialog"
    >
      {{ $t('language') }}:

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="closeAndSaveSettings">{{ $t('save') }}</el-button>
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
        <subSection v-model="projectData[name]" :project-data="projectData" />
      </el-tab-pane>

    </el-tabs>
  </section>
</template>

<style lang="scss">
 @import "./src/styles/main.scss";
</style>

<script>
import yaml from 'js-yaml'
import { loadArchive } from '../utils/archiveLoader.js'
import { saveArchive } from '../utils/archiveSaver.js'
import subSection from "../layout/subSection.vue"
import { useI18n } from "vue3-i18n";

import dialogExample from '../assets/dialogExample.yml?raw'
import menuExample from '../assets/menuExample.yml?raw'

import ruFlag from "../assets/lang-icons/ru.svg"
import enFlag from "../assets/lang-icons/en.svg"

export default {
  components: {
    subSection,
    ruFlag,
    enFlag
  },
  data() {
    return {
      projectData: {},
      sectionSelected: null,
      dialogAddSectionVisible: false,
      newTabName: null,
      newTabNameError: null,
      inclideDialogExample: false,
      inclideMenuExample: false,
      openSettingsVisible: false,
      settings: {
        language: 'ru',
      },
      avaliableLanguages: {
        en: enFlag,
        ru: ruFlag,
      },
    }
  },
  created() {
    this.readSettings()
    const i18n = useI18n()
    i18n.setLocale(this.settings.language)
  },
  methods: {
    changeLang(langSlug) {
      this.settings.language = langSlug
      this.saveSettings()
      document.location.reload()
    },
    closeAndSaveSettings() {
      this.openSettingsVisible = false
      this.saveSettings()
    },
    saveSettings() {
      localStorage.setItem('settings', JSON.stringify(this.settings));
    },
    readSettings() {
      const settings = JSON.parse(localStorage.getItem('settings'))
      if (settings) this.settings = settings
    },
    addTab() {
      if (this.newTabName.length <= 0) {
        this.newTabNameError = this.$t('error-title-name-empty')
        return
      }
      if (this.projectData[this.newTabName] || !this.newTabName.match(/^[a-z0-9_]+$/)) {
        this.newTabNameError = this.$t('exists-regex')
        return
      }

      this.projectData[this.newTabName] = {}

      if (this.inclideDialogExample) {
        const dialogExampleData = yaml.load(dialogExample)
        this.projectData[this.newTabName]['conversations'] = dialogExampleData.conversations
        this.projectData[this.newTabName]['conditions'] = dialogExampleData.conditions
        this.projectData[this.newTabName]['custom'] = dialogExampleData.custom
        this.projectData[this.newTabName]['events'] = dialogExampleData.events
        this.projectData[this.newTabName]['items'] = dialogExampleData.items
        this.projectData[this.newTabName]['journal'] = dialogExampleData.journal
        this.projectData[this.newTabName]['main'] = dialogExampleData.main
        this.projectData[this.newTabName]['objectives'] = dialogExampleData.objectives
      }
      this.inclideDialogExample = false

      if (this.inclideMenuExample) {
        const menuExampleData = yaml.load(menuExample)
        this.projectData[this.newTabName]['menus'] = menuExampleData
      }
      this.inclideMenuExample = false

      this.$message({
        dangerouslyUseHTMLString: true,
        message: `Section <b>${this.newTabName}</b> created!`,
        type: 'success'
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
    removeTab(tab) {
      this.$confirm(this.$t('delete-section').replace('{tab}', tab), this.$t('confirm'), {
        confirmButtonText: this.$t('delete'),
        cancelButtonText: this.$t('cancel'),
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

      const date = JSON.stringify(new Date());
      this.downloadBlob(blob, `bq${date}.json`)
    },
    saveAsZip() {
      if (!this.projectData) {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: this.$t('data-is-empty'),
          type: 'info'
        })
        return
      }
      saveArchive(this.projectData)
    },
    downloadBlob(blob, fileName) {
      const eElelent = document.createEvent('MouseEvents')
      const aElement = document.createElement('a')
      aElement.download = fileName
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
        this.$message({
          dangerouslyUseHTMLString: true,
          message: `Project loaded from <b>${index}</b> slot`,
          type: 'success'
        })
      }
    },
    saveLocalStorage(index) {
      localStorage.setItem(`projects_${index}`, JSON.stringify(this.projectData));
      this.$message({
        dangerouslyUseHTMLString: true,
        message: `Project saved to <b>${index}</b> slot`,
        type: 'success'
      })
    },
  }
}
</script>
