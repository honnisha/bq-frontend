<template>
  <el-tabs tab-position="left" class="section-tabs">
    <el-tab-pane label="Dialogues"><dialogue :init-data="sectionInfo.conversations" /></el-tab-pane>
    <el-tab-pane label="Events">{{ sectionInfo.events }}</el-tab-pane>
    <el-tab-pane label="Main">{{ sectionInfo.main }}</el-tab-pane>
    <el-tab-pane label="Conditions">{{ sectionInfo.conditions }}</el-tab-pane>
    <el-tab-pane label="Objectives">{{ sectionInfo.objectives }}</el-tab-pane>
    <el-tab-pane label="Journal">{{ sectionInfo.journal }}</el-tab-pane>
    <el-tab-pane label="Items">{{ sectionInfo.items }}</el-tab-pane>
    <el-tab-pane label="Custom">{{ sectionInfo.custom }}</el-tab-pane>
  </el-tabs>
</template>

<script>
import dialogue from "./dialogue.vue";

export default {
  components: {
    dialogue,
  },
  props: ['sectionInfo'],
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>
