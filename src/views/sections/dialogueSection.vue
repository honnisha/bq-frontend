<template>

  <div class="view-editor-section" v-if="!yamlEdit">
    <div class="menu-buttons">
      <el-button size="mini" @click="changeToYaml" class="menu-button">Yaml editor</el-button>
    </div>

    <h4>NPC_options:</h4>
    <el-space wrap class="dialogs-section">
      <el-card class="dialog-card" v-for="(dialogInfo, dialogKey) in modelValue.NPC_options" :key="dialogKey">

        <template #header>
          <div class="dialog-header">{{ dialogKey }}</div>
        </template>

        <el-row class="dialog-setting-section">
          <el-col :span="1">
            <el-tooltip class="item" effect="dark" content="Text" placement="left">
              <el-tag type="info" class="setting-header"><i class="el-icon-chat-line-round"></i></el-tag>
            </el-tooltip>
          </el-col>
          <el-col :span="23">
            <div class="setting-value">{{ dialogInfo.text }}</div>
          </el-col>
        </el-row>

        <el-row class="dialog-setting-section">
          <el-col :span="1">
            <el-tooltip class="item" effect="dark" content="Conditions" placement="left">
              <el-tag type="info" class="setting-header"><i class="el-icon-unlock"></i></el-tag>
            </el-tooltip>
          </el-col>
          <el-col :span="23">
            <div class="setting-value">{{ dialogInfo.conditions }}</div>
          </el-col>
        </el-row>

        <el-row class="dialog-setting-section">
          <el-col :span="1">
            <el-tooltip class="item" effect="dark" content="Events" placement="left">
              <el-tag type="info" class="setting-header"><i class="el-icon-magic-stick"></i></el-tag>
            </el-tooltip>
          </el-col>
          <el-col :span="23">
            <div class="setting-value">{{ dialogInfo.event }}</div>
          </el-col>
        </el-row>

        <el-row class="dialog-setting-section">
          <el-col :span="1">
            <el-tooltip class="item" effect="dark" content="Pointers" placement="left">
              <el-tag type="info" class="setting-header"><i class="el-icon-guide"></i></el-tag>
            </el-tooltip>
          </el-col>
          <el-col :span="23">
            <div class="setting-value">{{ dialogInfo.pointers }}</div>
          </el-col>
        </el-row>
      </el-card>
      
    </el-space>
  </div>
  
  <div class="yaml-editor-section" v-else>
    <div class="menu-buttons">
      <el-button size="mini" @click="changeToEditor" class="menu-button">Save and return visual editor</el-button>
    </div>

    <el-input
      class="yaml-editor"
      type="textarea"
      :autosize="{ minRows: 20, maxRows: 60}"
      v-model="yamlText"
    />
  </div>
</template>

<script>
import yaml from  'js-yaml'

export default {
  props: ['modelValue'],
  data() {
    return {
      yamlEdit: false,
      yamlText: null,
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
    changeToYaml() {
      this.yamlText = yaml.dump(this.localValue, {lineWidth: -1})
      this.yamlEdit = true
    },
    changeToEditor() {
      this.localValue = yaml.load(this.yamlText)
      this.yamlText = null
      this.yamlEdit = false
    },
  }
}
</script>
