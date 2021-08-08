<template>
  <el-tabs tab-position="left" v-model="sectionSelected" class="section-tabs" @tab-remove="removeDialogSection">

    <el-tab-pane :label="$t('dialogs')">
      <div class="menu-buttons">
        <el-button size="mini" @click="openNew('dialog')" class="menu-button" icon="el-icon-plus">{{ $t('add-dialog-section') }}</el-button>
        <el-button size="mini" @click="templateOpen" class="menu-button" icon="el-icon-document-add" type="primary" plain>{{ $t('template-create') }}</el-button>
      </div>

      <div class="dialogs-tabs">
        <el-tabs tab-position="left" v-model="dialogSelected" :closable="true" @tab-remove="removeDialogSection">
          <el-tab-pane :label="name" :name="name" v-for="(dialogInfo, name) in sectionInfo.conversations" :key="name">
            <template v-if="dialogSelected === name">
              <conversation v-model="sectionInfo.conversations[name]" :project-data="projectData"/>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-tab-pane>

    <el-tab-pane :label="$t('menus')">
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

    <el-tab-pane :label="$t('events')"><template v-if="sectionSelected === '2'"><simpleSection v-model="sectionInfo.events"/></template></el-tab-pane>
    <el-tab-pane :label="$t('conditions')"><template v-if="sectionSelected === '3'"><simpleSection v-model="sectionInfo.conditions"/></template></el-tab-pane>
    <el-tab-pane :label="$t('objectives')"><template v-if="sectionSelected === '4'"><simpleSection v-model="sectionInfo.objectives"/></template></el-tab-pane>
    <el-tab-pane :label="$t('items')"><template v-if="sectionSelected === '5'"><simpleSection v-model="sectionInfo.items"/></template></el-tab-pane>
    <el-tab-pane :label="$t('main')"><template v-if="sectionSelected === '6'"><yamlEditor v-model="sectionInfo.main"/></template></el-tab-pane>
    <el-tab-pane :label="$t('journal')"><template v-if="sectionSelected === '7'"><yamlEditor v-model="sectionInfo.journal"/></template></el-tab-pane>
    <el-tab-pane :label="$t('custom')"><template v-if="sectionSelected === '8'"><yamlEditor v-model="sectionInfo.custom"/></template></el-tab-pane>
  </el-tabs>

  <el-dialog
    :title="$t('create-subsection')"
    v-model="addVisible"
    width="30%"
    custom-class="create-section-dialog"
    :close-on-click-modal="false"
  >
    <el-alert v-if="newNameError" :title="newNameError" type="error"/>
    <span>{{ $t('dialog-section-name') }}</span>
    <el-input v-model="newName"></el-input>
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
    <el-tabs tab-position="left" v-if="templateDialogVisible" class="template-tabs">
      <el-tab-pane :label="templateInfo.label" :key="templateInfo.label" v-for="templateInfo in templates">
        <component :is="templateInfo.template" v-model="sectionInfo" @close="closeTemplate" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { shallowRef,  ref, computed } from 'vue'
import yaml from 'js-yaml'
import conversation from "../views/conversation.vue";
import simpleSection from "../views/simpleSection.vue";
import yamlEditor from "../views/yamlSection.vue";

import objective from "../components/templates/objective.vue";

export default {
  components: {
    conversation,
    simpleSection,
    yamlEditor,
  },
  props: ['modelValue', 'projectData'],
  data() {
    return {
      addVisible: false,
      newNameError: null,
      newName: '',
      dialogSelected: null,
      menuSelected: null,
      newMode: null,
      sectionSelected: '',
      templateDialogVisible: false,
      templates: [
        { label: this.$t('template-objective'), template: shallowRef(objective) },
      ],
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

        this.sectionInfo.conversations[this.newName] = {
          quester: this.newName,
          NPC_options: {},
          player_options: {},
        }
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
  }
}
</script>
