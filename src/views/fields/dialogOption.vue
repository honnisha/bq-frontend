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
        <div class="setting-value">{{ localValue.text }}</div>
      </el-col>
    </el-row>

    <el-row class="dialog-setting-section section-conditions">
      <el-col :span="1">
        <el-tooltip class="item" effect="dark" content="Conditions" placement="left">
          <el-tag type="info" class="setting-header"><i class="el-icon-unlock"></i></el-tag>
        </el-tooltip>
      </el-col>
      <el-col :span="23">
        <tagComplete type="conditions" v-model="localValue.conditions" :project-data="projectData"/>
      </el-col>
    </el-row>

    <el-row class="dialog-setting-section section-event">
      <el-col :span="1">
        <el-tooltip class="item" effect="dark" content="Events" placement="left">
          <el-tag type="info" class="setting-header"><i class="el-icon-magic-stick"></i></el-tag>
        </el-tooltip>
      </el-col>
      <el-col :span="23">
        <tagComplete type="events" v-model="localValue.events" :project-data="projectData"/>
      </el-col>
    </el-row>

    <el-row class="dialog-setting-section section-pointers">
      <el-col :span="1">
        <el-tooltip class="item" effect="dark" content="Pointers" placement="left">
          <el-tag type="info" class="setting-header"><i class="el-icon-guide"></i></el-tag>
        </el-tooltip>
      </el-col>
      <el-col :span="23">
        <tagComplete type="pointers" v-model="localValue.pointers" :project-data="projectData"/>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import tagComplete from "../fields/tagComplete.vue"

export default {
  components: {
    tagComplete,
  },
  props: ['modelValue', 'dialogKey', 'activeKey', 'projectData', 'section', 'dialogSectionInfo'],
  data() {
    return {
    }
  },
  created() {
    if (this.localValue.event) {
      this.localValue.events = this.localValue.event
      delete this.localValue['event']
    }
    if (this.localValue.condition) {
      this.localValue.conditions = this.localValue.condition
      delete this.localValue['condition']
    }
    if (this.localValue.pointer) {
      this.localValue.pointers = this.localValue.pointer
      delete this.localValue['pointer']
    }
  },
  computed: {
    localValue: {
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
      this.$confirm(`Delete ${dialogKey} from ${section}?`, 'Delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      }).then(() => {
        this.$emit('delete', section, dialogKey)
      })
    },
  }
}
</script>
