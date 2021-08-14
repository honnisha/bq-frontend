<template>
  <div v-if="!preview">
    <div class="menu-buttons">
      <el-button size="mini" class="menu-button" @click="togglePreview">{{ $t('preview') }}</el-button>
    </div>

    <el-alert v-if="error" :title="error" class="template-error" type="error"/>

    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-select') }}:</el-col>
      <el-col :span="18" class="field-editor">
        
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
      <el-col :span="6" class="field-name">{{ $t('template-quest-name') }}:</el-col>
      <el-col :span="18" class="field-editor"><el-input v-model="templateData.questName"/></el-col>
    </el-row>

    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-readable-name') }}:</el-col>
      <el-col :span="18" class="field-editor"><el-input v-model="templateData.questReadableName"/></el-col>
    </el-row>

    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-exp-reward') }}:</el-col>
      <el-col :span="18" class="field-editor"><el-input v-model="templateData.expReward"/></el-col>
    </el-row>

    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-money-reward') }}:</el-col>
      <el-col :span="18" class="field-editor"><el-input v-model="templateData.moneyReward"/></el-col>
    </el-row>

    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-level') }}:</el-col>
      <el-col :span="18" class="field-editor"><el-input v-model="templateData.requiedLevel"/></el-col>
    </el-row>
    
    <el-divider/>

    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-item-setting') }}:</el-col>
      <el-col :span="18">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.itemSetting"/>
      </el-col>
    </el-row>

    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-item-objective') }}:</el-col>
      <el-col :span="18">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.itemObjective"/>
      </el-col>
    </el-row>
    
    <el-divider/>

    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-player-option-1') }}:</el-col>
      <el-col :span="18">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.questPlayerOption1"/>
      </el-col>
    </el-row>
    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-NPC-option-1') }}:</el-col>
      <el-col :span="18">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.questNPCOption1"/>
      </el-col>
    </el-row>

    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-player-option-2') }}:</el-col>
      <el-col :span="18">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.questPlayerOption2"/>
      </el-col>
    </el-row>
    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-NPC-option-2') }}:</el-col>
      <el-col :span="18">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.questNPCOption2"/>
      </el-col>
    </el-row>
    
    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-player-option-3') }}:</el-col>
      <el-col :span="18">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.questPlayerOption3"/>
      </el-col>
    </el-row>
    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-NPC-option-3') }}:</el-col>
      <el-col :span="18">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.questNPCOption3"/>
      </el-col>
    </el-row>

    <el-divider/>

    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-journal-start') }}:</el-col>
      <el-col :span="18">
        <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData.journalStart"/>
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
import yaml from 'js-yaml'

import bringItem from '../../assets/templates-data/bringItem.yml?raw'

export default {
  props: ['modelValue', 'subSectionName'],
  data() {
    return {
      sectionInfo: null,
      templateData: {
        langSlug: this.$root.settings.language,
        questName: 'example',
        questReadableName: 'Example quest',
        expReward: '200',
        moneyReward: '1000',
        requiedLevel: '10',
        questPlayerOption1: '$default.quest_prefix$Hi!',
        questNPCOption1: 'Hello, do the quest for the glory of example!',
        questPlayerOption2: '$default.quest_yes_prefix$Okay, I will.',
        questNPCOption2: 'Go and do it!',
        questPlayerOption3: '$default.quest_done_prefix$I did what you told',
        questNPCOption3: 'Thank you!',
        journalStart: 'Started.',
        itemSetting: 'paper custom-model-data:330 name:&fItem_name lore:&7Item;&7description_space;&2Предмет_для_задания quest_items_unbreakable:true',
        itemObjective: 'action right item_name loc:-100;64;-100;world_rpg',
      },
      preview: false,
      previewText: null,
      error: null,
    }
  },
  computed: {
    projectData: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
  },
  created() {
    this.sectionInfo = this.projectData[this.subSectionName]
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
      let result = bringItem
      for (const [key, value] of Object.entries(this.templateData)) {
        result = result.replaceAll(`{${key}}`, value || '')
      }
      return result
    },
    apply() {
      try {
        this.error = null

        if (!this.templateData.quester) {
          this.error = this.$t('no-quester')
          return
        }
        const objData = yaml.load(this.getFormattedYaml())

        this.sectionInfo.conversations[this.templateData.quester].NPC_options = Object.assign(
          {},
          this.sectionInfo.conversations[this.templateData.quester].NPC_options,
          objData.conversations.NPC_options
        )
        this.sectionInfo.conversations[this.templateData.quester].player_options = Object.assign(
          {},
          this.sectionInfo.conversations[this.templateData.quester].player_options,
          objData.conversations.player_options
        )

        this.sectionInfo.events = Object.assign({}, this.sectionInfo.events, objData.events)
        this.sectionInfo.conditions = Object.assign({}, this.sectionInfo.conditions, objData.conditions)
        this.sectionInfo.journal = Object.assign({}, this.sectionInfo.journal, objData.journal)
        this.sectionInfo.objectives = Object.assign({}, this.sectionInfo.objectives, objData.objectives)
        this.sectionInfo.items = Object.assign({}, this.sectionInfo.items, objData.items)

        if (!this.sectionInfo.main) this.sectionInfo.main = { variables: {}, npcs: {}, compass: {} }
        this.sectionInfo.main.variables = Object.assign({}, this.sectionInfo.main.variables, objData.main.variables)

        this.$message({
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: this.$t('template-applyed'),
        })
        this.$emit('close')
      } catch (e) {
        let error = e
        if (e.name === 'YAMLException') {
          error = e.message
        }
        this.error = error
      }
    }
  }
}
</script>
