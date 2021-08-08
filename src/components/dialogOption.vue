<template>
  <el-card class="dialog-card">

    <template #header>
      <div class="dialog-header">{{ dialogKey }}</div>
      <el-tag type="info" class="setting-header" @click="renameDialog(section, dialogKey)"><i class="el-icon-edit"></i></el-tag>
      <el-tag type="info" class="setting-header" @click="deleteDialog(section, dialogKey)"><i class="el-icon-delete"></i></el-tag>
    </template>

    <el-row class="dialog-setting-section section-lang">
      <el-col :span="1">
        <el-tooltip class="item" effect="dark" content="Text" placement="left">
          <el-tag type="info" class="setting-header"><i class="el-icon-chat-line-round"></i></el-tag>
        </el-tooltip>
      </el-col>
      <el-col :span="23">
        <langField v-model="dialogInfo.text" />
      </el-col>
    </el-row>

    <el-row class="dialog-setting-section section-conditions">
      <el-col :span="1">
        <el-tooltip class="item" effect="dark" content="Conditions" placement="left">
          <el-tag type="info" class="setting-header"><i class="el-icon-unlock"></i></el-tag>
        </el-tooltip>
      </el-col>
      <el-col :span="23">
        <tagComplete type="conditions" v-model="dialogInfo.conditions" :section="section" :project-data="projectData"/>
      </el-col>
    </el-row>

    <el-row class="dialog-setting-section section-event">
      <el-col :span="1">
        <el-tooltip class="item" effect="dark" content="Events" placement="left">
          <el-tag type="info" class="setting-header"><i class="el-icon-magic-stick"></i></el-tag>
        </el-tooltip>
      </el-col>
      <el-col :span="23">
        <tagComplete type="events" v-model="dialogInfo.events" :section="section" :project-data="projectData"/>
      </el-col>
    </el-row>

    <el-row class="dialog-setting-section section-pointers">
      <el-col :span="1">
        <el-tooltip class="item" effect="dark" content="Pointers" placement="left">
          <el-tag type="info" class="setting-header"><i class="el-icon-guide"></i></el-tag>
        </el-tooltip>
      </el-col>
      <el-col :span="23">
        <tagComplete type="pointers" v-model="dialogInfo.pointers" :section="section" :project-data="projectData"/>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import tagComplete from "./tagComplete.vue"
import langField from "./langField.vue"

export default {
  components: {
    tagComplete,
    langField,
  },
  props: ['modelValue', 'dialogKey', 'activeKey', 'projectData', 'section', 'dialogSectionInfo'],
  data() {
    return {
    }
  },
  created() {
    if (this.dialogInfo.event) {
      this.dialogInfo.events = this.dialogInfo.event
      delete this.dialogInfo['event']
    }
    if (this.dialogInfo.condition) {
      this.dialogInfo.conditions = this.dialogInfo.condition
      delete this.dialogInfo['condition']
    }
    if (this.dialogInfo.pointer) {
      this.dialogInfo.pointers = this.dialogInfo.pointer
      delete this.dialogInfo['pointer']
    }
  },
  computed: {
    dialogInfo: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
  },
  methods: {
    renameDialog(section, dialogKey) {
      this.$prompt('Enter new name', 'Dialog', {
        confirmButtonText: 'Rename',
        cancelButtonText: 'Cancel',
        inputPattern: /^[a-zA-Z0-9_]+$/,
        inputErrorMessage: 'Already exists or bad name (use only a-z A-Z 0-9 and _)',
        inputValidator: value => !this.dialogSectionInfo[section][value],
        inputValue: dialogKey,
      }).then(({ value }) => {
        this.$emit('rename', section, dialogKey, value)
      })
    },
    deleteDialog(section, dialogKey) {
      this.$confirm(this.$t('delete-section-key').replace('{section}', section).replace('{dialogKey}', dialogKey), this.$t('delete'), {
        confirmButtonText: this.$t('delete'),
        cancelButtonText: this.$t('cancel'),
      }).then(() => {
        this.$emit('delete', section, dialogKey)
      })
    },
  }
}
</script>
