<template>
  <el-tabs tab-position="left" v-model="sectionSelected" class="section-tabs" @tab-remove="removeDialogSection">

    <el-tab-pane name="dialogs" lazy>
      <template #label>
        <span>{{ $t('dialogs') }} <i class="el-icon-chat-line-round"></i></span>
      </template>
      <div class="menu-buttons">
        <el-button size="mini" @click="openNew('dialog')" class="menu-button" icon="el-icon-plus">{{ $t('add-dialog-section') }}</el-button>
      </div>

      <div class="dialogs-tabs">
        <el-tabs tab-position="left" v-model="dialogSelected" :closable="true" @tab-remove="removeDialogSection" @tab-click="dialogSectionSelect">
          <el-tab-pane :label="dialogSectionName" :name="dialogSectionName" v-for="(_, dialogSectionName) in sectionInfo.conversations" :key="dialogSectionName" lazy>

            <conversation
              v-model="sectionInfo.conversations[dialogSectionName]"
              :dialog-section-name="dialogSectionName"
              :project-data="projectData"
              :sub-section-name="subSectionName"
            />

          </el-tab-pane>
        </el-tabs>
      </div>
    </el-tab-pane>

    <el-tab-pane lazy>
      <template #label>
        <span>{{ $t('menus') }} <i class="el-icon-s-grid"></i></span>
      </template>
      <div class="menu-buttons">
        <el-button size="mini" @click="openNew('menu')" class="menu-button">{{ $t('add-menu') }}</el-button>
      </div>

      <div class="dialogs-tabs">
        <el-tabs tab-position="left" v-model="menuSelected">
          <el-tab-pane lazy :label="name" :name="name" v-for="(menuInfo, name) in sectionInfo.menus" :key="name">
            <yamlEditor v-model="sectionInfo.menus[name]"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-tab-pane>

    <el-tab-pane lazy name="main">
      <template #label>
        <span>{{ $t('main') }} <i class="el-icon-setting"></i></span>
      </template>
      <yamlEditor v-model="sectionInfo.main"/>
    </el-tab-pane>

    <el-tab-pane lazy name="events">
      <template #label>
        <span>{{ $t('events') }} <i class="el-icon-magic-stick"></i></span>
      </template>
      <yamlEditor v-model="sectionInfo.events"/>
    </el-tab-pane>

    <el-tab-pane lazy name="conditions">
      <template #label>
        <span>{{ $t('conditions') }} <i class="el-icon-lock"></i></span>
      </template>
      <yamlEditor v-model="sectionInfo.conditions"/>
    </el-tab-pane>

    <el-tab-pane lazy name="objectives">
      <template #label>
        <span>{{ $t('objectives') }} <i class="el-icon-document-checked"></i></span>
      </template>
      <yamlEditor v-model="sectionInfo.objectives"/>
    </el-tab-pane>

    <el-tab-pane lazy name="items">
      <template #label>
        <span>{{ $t('items') }} <i class="el-icon-shopping-bag-2"></i></span>
      </template>
      <itemsEditor v-model="sectionInfo.items"/>
    </el-tab-pane>

    <el-tab-pane lazy name="journal">
      <template #label>
        <span>{{ $t('journal') }} <i class="el-icon-tickets"></i></span>
      </template>
      <yamlEditor v-model="sectionInfo.journal"/>
    </el-tab-pane>

    <el-tab-pane lazy name="custom">
      <template #label>
        <span>{{ $t('custom') }} <i class="el-icon-more-outline"></i></span>
      </template>
      <yamlEditor v-model="sectionInfo.custom"/>
    </el-tab-pane>
  </el-tabs>

  <el-dialog
    :title="$t('create-subsection')"
    v-model="addVisible"
    width="30%"
    custom-class="create-section-dialog"
    :close-on-click-modal="false"
  >
    <el-alert v-if="newNameError" :title="newNameError" type="error"/>

    <div class="dialog-subsection">
      <span>{{ $t('dialog-section-name') }}</span>
      <el-input v-model="newName"></el-input>
    </div>

    <div class="dialog-subsection" v-if="newMode === 'dialog'">
      <span>{{ $t('dialog-quester-npc-id') }}</span>
      <el-input v-model="newNPCID"></el-input>
    </div>

    <div class="dialog-subsection" v-if="newMode === 'dialog'">
      <el-checkbox v-model="newNPCholograms" :disabled="!newNPCID">{{ $t('add-configs-hologram-and-conditions-for-npc') }}</el-checkbox>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="addDialog">{{ $t('create') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import conversation from "./conversation.vue"
import simpleSection from "./simpleSection.vue"
import yamlEditor from "./yamlSection.vue"
import itemsEditor from "./itemsEditor.vue"
import { createNewNpcSection } from "../utils/createNewNpcSection.js"

import moveTo from '../assets/templates-data/moveTo.yml?raw'

export default {
  components: {
    conversation,
    simpleSection,
    yamlEditor,
    itemsEditor,
  },
  props: ['modelValue', 'projectData', 'subSectionName'],
  data() {
    return {
      addVisible: false,
      newNameError: null,
      newName: '',
      newNPCID: null,
      newNPCholograms: false,
      dialogSelected: null,
      menuSelected: null,
      newMode: null,
      sectionSelected: 'dialogs',
      loadedDialogsections: {},
    }
  },
  computed: {
    sectionInfo: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
  },
  methods: {
    removeDialogSection(tab) {
      this.$confirm(this.$t('delete-section').replace('{tab}', tab), this.$t('confirm'), {
        confirmButtonText: this.$t('delete'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        delete this.projectData[tab]
        this.$message({
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: this.$t('tab-deleted').replace('{tab}', tab)
        });
      })
    },
    addDialog() {
      if (this.newName.length <= 0) {
        this.newNameError = this.$t('empty-title')
        return
      }

      if (!this.sectionInfo.conversations) this.sectionInfo.conversations = {}

      if (this.newMode === 'dialog') {
        if (this.sectionInfo.conversations[this.newName]) {
          this.newNameError = this.$t('dialog-exists').replace('{newName}', this.newName)
          return
        }
        if (!this.newName.match(/^[a-z0-9_]+$/)) {
          this.newNameError = this.$t('exists-regex')
          return
        }
        if (this.newNPCID) {
          if (!this.newNPCID.match(/^[0-9]+$/)) {
            this.newNameError = this.$t('id-only-numbers')
            return
          }
        }

        createNewNpcSection(
          this.sectionInfo, this.newName, this.newNPCID, this.newNPCholograms, this.$root.settings.language
        )

        this.dialogSelected = this.newName
        this.newNPCID = null
        this.newNPCholograms = false
        
        this.$message({
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: this.$t('dialog-section-created').replace('{newName}', this.newName)
        })
      }
      else if (this.newMode === 'menu') {
        if (!this.sectionInfo.menus) sectionInfo.menus = {}

        if (sectionInfo.menus[this.newName]) {
          this.newNameError = this.$t('menu-section-exists').replace('{newName}', this.newName)
          return
        }

        if (!sectionInfo.menus) sectionInfo.menus = {}
        sectionInfo.menus[this.newName] = {}

        this.$message({
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: this.$t('menu-section-created').replace('{newName}', this.newName)
        })
      }

      this.newName = null
      this.includeExample = false
      this.addVisible = false
      this.newNameError = null
      this.newMode = null
    },
    removeDialogSection(section) {
      this.$confirm(this.$t('delete-dialog-section'), this.$t('delete'), {
        confirmButtonText: this.$t('delete'),
        cancelButtonText: this.$t('cancel'),
      }).then(() => {
        delete this.sectionInfo.conversations[section]
        this.$message({
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: this.$t('dialog-section-deleted').replace('{section}', section),
        })
      })
    },
    openNew(mode) {
      this.includeExample = false
      this.newMode = mode
      this.newName = ''
      this.addVisible = true
    },
    dialogSectionSelect(tab, event) {
      this.loadedDialogsections[tab.paneName] = true
    }
  }
}
</script>
