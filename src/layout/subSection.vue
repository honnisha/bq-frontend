<template>
  <el-tabs tab-position="left" v-model="sectionSelected" class="section-tabs" @tab-remove="removeDialogSection">

    <el-tab-pane name="dialogs">
      <template #label>
        <span>{{ $t('dialogs') }} <i class="el-icon-chat-line-round"></i></span>
      </template>
      <div class="menu-buttons">
        <el-button size="mini" @click="openNew('dialog')" class="menu-button" icon="el-icon-plus">{{ $t('add-dialog-section') }}</el-button>
        <el-button size="mini" @click="templateOpen" class="menu-button" icon="el-icon-document-add" type="primary" plain>{{ $t('template-create') }}</el-button>
      </div>

      <div class="dialogs-tabs">
        <el-tabs tab-position="left" v-model="dialogSelected" :closable="true" @tab-remove="removeDialogSection" @tab-click="dialogSectionSelect">
          <el-tab-pane :label="dialogSectionName" :name="dialogSectionName" v-for="(_, dialogSectionName) in sectionInfo.conversations" :key="dialogSectionName">
            <template v-if="loadedDialogsections[dialogSectionName]">

              <conversation
                v-model="sectionInfo.conversations[dialogSectionName]"
                :dialog-section-name="dialogSectionName"
                :project-data="projectData"
                :sub-section-name="subSectionName"
              />

            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-tab-pane>

    <el-tab-pane>
      <template #label>
        <span>{{ $t('menus') }} <i class="el-icon-s-grid"></i></span>
      </template>
      <div class="menu-buttons">
        <el-button size="mini" @click="openNew('menu')" class="menu-button">{{ $t('add-menu') }}</el-button>
      </div>

      <div class="dialogs-tabs">
        <el-tabs tab-position="left" v-model="menuSelected">
          <el-tab-pane :label="name" :name="name" v-for="(menuInfo, name) in sectionInfo.menus" :key="name">
            <yamlEditor v-model="sectionInfo.menus[name]"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-tab-pane>

    <el-tab-pane name="main">
      <template #label>
        <span>{{ $t('main') }} <i class="el-icon-setting"></i></span>
      </template>
      <yamlEditor v-model="sectionInfo.main" v-if="sectionSelected === 'main'" />
    </el-tab-pane>

    <el-tab-pane name="events">
      <template #label>
        <span>{{ $t('events') }} <i class="el-icon-magic-stick"></i></span>
      </template>
      <yamlEditor v-model="sectionInfo.events" v-if="sectionSelected === 'events'" />
    </el-tab-pane>

    <el-tab-pane name="conditions">
      <template #label>
        <span>{{ $t('conditions') }} <i class="el-icon-lock"></i></span>
      </template>
      <yamlEditor v-model="sectionInfo.conditions" v-if="sectionSelected === 'conditions'" />
    </el-tab-pane>

    <el-tab-pane name="objectives">
      <template #label>
        <span>{{ $t('objectives') }} <i class="el-icon-document-checked"></i></span>
      </template>
      <yamlEditor v-model="sectionInfo.objectives" v-if="sectionSelected === 'objectives'" />
    </el-tab-pane>

    <el-tab-pane name="items">
      <template #label>
        <span>{{ $t('items') }} <i class="el-icon-shopping-bag-2"></i></span>
      </template>
      <yamlEditor v-model="sectionInfo.items" v-if="sectionSelected === 'items'" />
    </el-tab-pane>

    <el-tab-pane name="journal">
      <template #label>
        <span>{{ $t('journal') }} <i class="el-icon-tickets"></i></span>
      </template>
      <yamlEditor v-model="sectionInfo.journal" v-if="sectionSelected === 'journal'" />
    </el-tab-pane>

    <el-tab-pane name="custom">
      <template #label>
        <span>{{ $t('custom') }} <i class="el-icon-more-outline"></i></span>
      </template>
      <yamlEditor v-model="sectionInfo.custom" v-if="sectionSelected === 'custom'" />
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
        <el-button type="primary" @click="addDialoge">{{ $t('create') }}</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    :title="$t('template-dialog')"
    v-model="templateDialogVisible"
    width="80%"
    custom-class="template-dialog"
    :close-on-click-modal="false"
  >
    <templateView v-model="projectData" :sub-section-name="subSectionName" @close="closeTemplate"/>
  </el-dialog>
</template>

<script>
import yaml from 'js-yaml'
import conversation from "../views/conversation.vue";
import simpleSection from "../views/simpleSection.vue";
import yamlEditor from "../views/yamlSection.vue";
import templateView from "../views/templateView.vue";

import moveTo from '../assets/templates-data/moveTo.yml?raw'

import defaultConversation from '../assets/defaultConversation.yml?raw'

export default {
  components: {
    conversation,
    simpleSection,
    yamlEditor,
    templateView,
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
      templateDialogVisible: false,
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
    templateOpen() {
      this.templateDialogVisible = true
    },
    createTemplate() {
      this.templateDialogVisible = false
    },
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
    addDialoge() {
      if (this.newName.length <= 0) {
        this.newNameError = this.$t('empty-title')
        return
      }

      if (!this.sectionInfo.conversations) this.sectionInfo.conversations = {}

      if (this.newMode === 'dialog') {
        if (!this.sectionInfo.conversations) this.sectionInfo.conversations = {}

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

        let defaultConversationText = defaultConversation
        defaultConversationText = defaultConversationText.replaceAll(
          '{npcName}', this.newName
        ).replaceAll(
          '{npcID}', this.newNPCID
        ).replaceAll(
          '{langSlug}', this.$root.settings.language
        )
        const defaultConversation = yaml.load(newConfigHologramText)

        this.sectionInfo.conversations[this.newName] = defaultConversation.conversations

        if (this.newNPCID) {
          this.sectionInfo.main.npcs[this.newNPCID] = this.newName

          if (!this.sectionInfo.custom) this.sectionInfo.custom = { npc_holograms: { check_interval: 100 } }
          if (this.newNPCholograms) {
            this.sectionInfo.custom.npc_holograms = Object.assign(
              {}, this.sectionInfo.custom.npc_holograms, defaultConversation.npc_holograms
            )
          }
          if (this.newNPCholograms) {
            this.sectionInfo.conditions = Object.assign(
              {}, this.sectionInfo.conditions, defaultConversation.conditions
            )
          }
          this.newNPCholograms = false

        }
        this.newNPCID = null

        this.dialogSelected = this.newName
        this.$message({
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: this.$t('dialog-section-created').replace('{newName}', this.newName)
        })

      } else if (this.newMode === 'menu') {
        if (!this.sectionInfo.menus) this.sectionInfo.menus = {}

        if (this.sectionInfo.menus[this.newName]) {
          this.newNameError = this.$t('menu-section-exists').replace('{newName}', this.newName)
          return
        }

        if (!this.sectionInfo.menus) this.sectionInfo.menus = {}
        this.sectionInfo.menus[this.newName] = {}
        
        this.$message({
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: this.$t('menu-section-created').replace('{newName}', this.newName)
        })
      }

      this.dialogSelected = this.newName
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
    closeTemplate() {
      this.templateDialogVisible = false
    },
    dialogSectionSelect(tab, event) {
      this.loadedDialogsections[tab.paneName] = true
    }
  }
}
</script>
