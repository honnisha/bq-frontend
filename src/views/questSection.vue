<template>
  <el-tabs tab-position="left" v-model="sectionSelected" class="section-tabs" @tab-remove="removeDialogSection">

    <el-tab-pane :label="$t('dialogs')">
      <div class="menu-buttons">
        <el-button size="mini" @click="openNew('dialog')" class="menu-button" icon="el-icon-plus">{{ $t('add-dialog-section') }}</el-button>
      </div>

      <div class="dialogs-tabs">
        <el-tabs tab-position="left" v-model="dialogSelected">
          <el-tab-pane :label="name" :name="name" v-for="(dialogInfo, name) in sectionInfo.conversations" :key="name">
            <template v-if="dialogSelected === name">
              <dialogSection v-model="sectionInfo.conversations[name]" :project-data="projectData"/>
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
</template>

<script>
import yaml from 'js-yaml'
import dialogSection from "./sections/dialogSection.vue";
import simpleSection from "./sections/simpleSection.vue";
import yamlEditor from "./sections/yamlEditor.vue";

export default {
  components: {
    dialogSection,
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
    openNew(mode) {
      this.includeExample = false
      this.newMode = mode
      this.newName = ''
      this.addVisible = true
    },
  }
}
</script>
