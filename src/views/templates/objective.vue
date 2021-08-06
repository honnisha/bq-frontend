<template>
  <div v-if="!preview">
    <div class="menu-buttons">
      <el-button size="mini" class="menu-button" @click="togglePreview">{{ $t('preview') }}</el-button>
    </div>

    <el-row class="template-setting">
      <el-col :span="5" class="field-name">{{ $t('template-quest-select') }}:</el-col>
      <el-col :span="19" class="field-editor">
        
        <el-select v-model="templateData.quester" placeholder=" ">
          <el-option
            v-for="(info, key) in sectionInfo.conversations"
            :key="key"
            :label="key"
            :value="key">
          </el-option>
        </el-select>

      </el-col>
    </el-row>

    <el-row class="template-setting">
      <el-col :span="5" class="field-name">{{ $t('template-quest-name') }}:</el-col>
      <el-col :span="19" class="field-editor"><el-input v-model="templateData.questName"/></el-col>
    </el-row>

    <el-row class="template-setting">
      <el-col :span="5" class="field-name">{{ $t('template-quest-readable-name') }}:</el-col>
      <el-col :span="19" class="field-editor"><el-input v-model="templateData.questReadableName"/></el-col>
    </el-row>

    <el-row class="template-setting">
      <el-col :span="5" class="field-name">{{ $t('template-quest-exp-reward') }}:</el-col>
      <el-col :span="19" class="field-editor"><el-input v-model="templateData.expReward"/></el-col>
    </el-row>

    <el-row class="template-setting">
      <el-col :span="5" class="field-name">{{ $t('template-quest-money-reward') }}:</el-col>
      <el-col :span="19" class="field-editor"><el-input v-model="templateData.moneyReward"/></el-col>
    </el-row>

    <el-row class="template-setting">
      <el-col :span="5" class="field-name">{{ $t('template-quest-level') }}:</el-col>
      <el-col :span="19" class="field-editor"><el-input v-model="templateData.requiedLevel"/></el-col>
    </el-row>
    
    <el-divider/>

    <el-row class="template-setting">
      <el-col :span="5" class="field-name">{{ $t('template-quest-player-option-1') }}:</el-col>
      <el-col :span="19">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.questPlayerOption1"/>
      </el-col>
    </el-row>
    <el-row class="template-setting">
      <el-col :span="5" class="field-name">{{ $t('template-quest-NPC-option-1') }}:</el-col>
      <el-col :span="19">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.questNPCOption1"/>
      </el-col>
    </el-row>

    <el-row class="template-setting">
      <el-col :span="5" class="field-name">{{ $t('template-quest-player-option-2') }}:</el-col>
      <el-col :span="19">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.questPlayerOption2"/>
      </el-col>
    </el-row>
    <el-row class="template-setting">
      <el-col :span="5" class="field-name">{{ $t('template-quest-NPC-option-2') }}:</el-col>
      <el-col :span="19">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.questNPCOption2"/>
      </el-col>
    </el-row>

    
    <el-row class="template-setting">
      <el-col :span="5" class="field-name">{{ $t('template-quest-player-option-3') }}:</el-col>
      <el-col :span="19">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.questPlayerOption3"/>
      </el-col>
    </el-row>
    <el-row class="template-setting">
      <el-col :span="5" class="field-name">{{ $t('template-quest-NPC-option-3') }}:</el-col>
      <el-col :span="19">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.questNPCOption3"/>
      </el-col>
    </el-row>

    <el-divider/>

    <el-row class="template-setting">
      <el-col :span="5" class="field-name">{{ $t('template-quest-journal-start') }}:</el-col>
      <el-col :span="19">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.journalStart"/>
      </el-col>
    </el-row>
    <el-row class="template-setting">
      <el-col :span="5" class="field-name">{{ $t('template-quest-journal-done') }}:</el-col>
      <el-col :span="19">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.journalDone"/>
      </el-col>
    </el-row>
    
    <div class="right-section">
      <el-button type="success" @click="apply">{{ $t('apply') }}</el-button>
    </div>
  </div>

  <div v-else>
    <div class="menu-buttons">
      <el-button size="mini" class="menu-button" @click="toggleEdit">{{ $t('return-to-edit') }}</el-button>
    </div>
    <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 50}" v-model="previewText" :readonly="true" />
  </div>
</template>

<script>
import objective from '../../assets/templates-data/objective.yml?raw'

export default {
  props: ['modelValue'],
  data() {
    return {
      templateData: {
        langSlug: this.$root.settings.language,
      },
      preview: false,
      previewText: null,
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
    togglePreview() {
      this.previewText = this.getFormattedYaml()
      this.preview = true
    },
    toggleEdit() {
      this.previewText = null
      this.preview = false
    },
    getFormattedYaml() {
      let result = objective
      for (const [key, value] of Object.entries(this.templateData)) {
        result = result.replaceAll(`{${key}}`, value || '')
      }
      return result
    },
    apply() {
      
    }
  }
}
</script>
