<template>
  <el-card class="dialog-card">

    <template #header>
      <div class="dialog-header">{{ dialogName }}</div>
      <el-tag type="info" class="setting-header" @click="renameDialog()"><i class="el-icon-edit"></i></el-tag>
      <el-tag type="info" class="setting-header" @click="deleteDialog()"><i class="el-icon-delete"></i></el-tag>
      <langHeader @newLang="newLang" />

      <template v-if="dialogType == 'player_options'">
        <el-tooltip class="item" effect="light" :content="$t('add-dialog-to-first-option')" placement="top">
          <el-tag type="info" class="setting-header" @click="addDialogToFirstOption()"><i class="el-icon-link"></i></el-tag>
        </el-tooltip>
      </template>
    </template>

    <el-row class="dialog-setting-section section-lang">
      <el-col :span="24">
        <langField ref="dialogLangs" v-model="dialogInfo.text" :max-rows="10" />
      </el-col>
    </el-row>

    <el-row class="dialog-setting-section section-conditions">
      <el-col :span="24">
        <tagComplete
          type="conditions"
          v-model="dialogInfo.conditions"
          :options="options.conditions"
          :dialog-section-name="dialogSectionName"
          :dialog-type="dialogType"
          :placeholder="$t('conditions')"
        />
      </el-col>
    </el-row>

    <el-row class="dialog-setting-section section-event">
      <el-col :span="24">
        <tagComplete
          type="events"
          v-model="dialogInfo.events"
          :options="options.events"
          :dialog-section-name="dialogSectionName"
          :dialog-type="dialogType"
          :placeholder="$t('events')"
        />
      </el-col>
    </el-row>

    <el-row class="dialog-setting-section section-pointers">
      <el-col :span="24">
        <tagComplete
          type="pointers"
          v-model="dialogInfo.pointers"
          :options="options.pointers[dialogType]"
          :dialog-section-name="dialogSectionName"
          :dialog-type="dialogType"
          :placeholder="$t('pointers')"
        />
      </el-col>
    </el-row>

  </el-card>
</template>

<script>
import tagComplete from "./tagComplete.vue"
import langField from "./langField.vue"
import langHeader from "./langHeader.vue";

export default {
  components: {
    tagComplete,
    langField,
    langHeader,
  },
  props: ['modelValue', 'dialogType', 'subSectionName', 'dialogName', 'dialogSectionName', 'dialogSectionInfo', 'options'],
  data() {
    return {
    }
  },
  created() {
    if (this.dialogInfo === undefined) {
      console.error(`dialogInfo is undefined in dialogOption; dialogType: ${this.dialogType} dialogName: ${this.dialogName}`)
      return
    }
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
    renameDialog() {
      this.$prompt(this.$t('enter-new-name'), this.$t('rename'), {
        confirmButtonText: 'Rename',
        cancelButtonText: 'Cancel',
        inputPattern: /^[a-zA-Z0-9_]+$/,
        inputErrorMessage: this.$t('exists-regex'),
        inputValidator: value => !this.dialogSectionInfo[this.dialogType][value],
        inputValue: this.dialogName,
      }).then(({ value }) => {
        this.$emit('rename', this.dialogName, this.dialogType, value)
      })
    },
    deleteDialog() {
      this.$confirm(this.$t('delete-section-key').replace('{name}', this.dialogName).replace('{from}', this.dialogSectionName), this.$t('delete'), {
        confirmButtonText: this.$t('delete'),
        cancelButtonText: this.$t('cancel'),
      }).then(() => {
        this.$emit('delete', this.dialogType, this.dialogName)
      })
    },
    newLang(langName) {
      if (!this.dialogInfo.text) this.dialogInfo.text = {}
      this.dialogInfo.text[langName] = ''
    },
    addDialogToFirstOption() {
      const first = this.dialogSectionInfo.first
      if (first) {
        const pointers = this.dialogSectionInfo.NPC_options[first].pointers

        if (!pointers.includes(this.dialogName)) {
          const newFirstPointers = `${this.dialogName},${pointers}`
          this.$emit('updateFirstPointers', newFirstPointers)
        }
      }
    }
  }
}
</script>
