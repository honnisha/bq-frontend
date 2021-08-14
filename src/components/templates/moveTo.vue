<template>
  <div v-if="!preview">
    <div class="menu-buttons">
      <el-button size="mini" class="menu-button" @click="togglePreview">{{ $t('preview') }}</el-button>
    </div>

    <el-alert v-if="error" :title="error" class="template-error" type="error"/>

    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-select-from') }}:</el-col>
      <el-col :span="18" class="field-editor">
        <el-select v-model="templateData.questerFrom" placeholder=" ">
          <el-option
            v-for="data in questers"
            :key="`from_${data.quester}`"
            :label="`${data.sectionKey}.${data.quester}`"
            :value="`${data.sectionKey}.${data.quester}`"
          />
        </el-select>
      </el-col>
    </el-row>

    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-select-to') }}:</el-col>
      <el-col :span="18" class="field-editor">
        <el-select v-model="templateData.questerTo" placeholder=" ">
          <el-option
            v-for="data in questers"
            :key="`to_${data.quester}`"
            :label="`${data.sectionKey}.${data.quester}`"
            :value="`${data.sectionKey}.${data.quester}`"
          />
        </el-select>
      </el-col>
    </el-row>
    
    <el-divider/>

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
      <el-col :span="6" class="field-name">{{ $t('template-quest-compass-name') }}:</el-col>
      <el-col :span="18" class="field-editor"><el-input v-model="templateData.compassName"/></el-col>
    </el-row>

    <el-row class="template-setting">
      <el-col :span="6" class="field-name">{{ $t('template-quest-compass-location') }}:</el-col>
      <el-col :span="18" class="field-editor"><el-input v-model="templateData.compassLocation"/></el-col>
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

    <el-divider/>

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

    <el-divider/>

    <el-row class="template-setting">
      <el-checkbox v-model="templateData.addToFirst">{{ $t('template-add-to-first-message') }}</el-checkbox>
    </el-row>

    <el-row class="template-setting">
      <el-checkbox v-model="templateData.addToHologram">{{ $t('template-add-to-hologram-conditions') }}</el-checkbox>
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

import moveTo from '../../assets/templates-data/moveTo.yml?raw'

export default {
  props: ['modelValue', 'subSectionName'],
  data() {
    return {
      sectionInfo: null,
      templateData: {
        addToFirst: true,
        addToHologram: true,
        questerFrom: null,
        questerTo: null,
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
        compassName: 'Target',
        compassLocation: '100;66;100;world_rpg',
      },
      preview: false,
      previewText: null,
      error: null,
      questers: [],
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
    for (const [sectionKey, sectionData] of Object.entries(this.projectData)) {
      for (const [quester, _] of Object.entries(sectionData.conversations)) {
        this.questers.push({quester: quester , sectionKey: sectionKey})
      }
    }
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
      let result = moveTo
      for (const [key, value] of Object.entries(this.templateData)) {
        result = result.replaceAll(`{${key}}`, value || '')
      }

      if (this.templateData.questerFrom) {
        let sectionQuesterFrom = this.templateData.questerFrom.split('.')[0]
        result = result.replaceAll('{sectionQuesterFrom}', sectionQuesterFrom)
      }

      return result
    },
    apply() {
      try {
        this.error = null

        if (!this.templateData.questerFrom || !this.templateData.questerTo) {
          this.error = this.$t('no-quester')
          return
        }
        let questerFrom = this.templateData.questerFrom.split('.')[1]
        let sectionQuesterFrom = this.templateData.questerFrom.split('.')[0]

        let questerTo = this.templateData.questerTo.split('.')[1]
        let sectionQuesterTo = this.templateData.questerTo.split('.')[0]

        let objData = yaml.load(this.getFormattedYaml())

        const fromSectionInfo = this.projectData[sectionQuesterFrom]
        const toSectionInfo = this.projectData[sectionQuesterTo]

        fromSectionInfo.conversations[questerFrom].NPC_options = Object.assign(
          {}, fromSectionInfo.conversations[questerFrom].NPC_options,
          objData.conversations.from.NPC_options
        )
        fromSectionInfo.conversations[questerFrom].player_options = Object.assign(
          {}, fromSectionInfo.conversations[questerFrom].player_options,
          objData.conversations.from.player_options
        )

        toSectionInfo.conversations[questerTo].NPC_options = Object.assign(
          {}, toSectionInfo.conversations[questerTo].NPC_options,
          objData.conversations.to.NPC_options
        )
        toSectionInfo.conversations[questerTo].player_options = Object.assign(
          {}, toSectionInfo.conversations[questerTo].player_options,
          objData.conversations.to.player_options
        )

        fromSectionInfo.events = Object.assign({}, fromSectionInfo.events, objData.events)
        fromSectionInfo.conditions = Object.assign({}, fromSectionInfo.conditions, objData.conditions)
        fromSectionInfo.journal = Object.assign({}, fromSectionInfo.journal, objData.journal)

        if (!fromSectionInfo.main) fromSectionInfo.main = { variables: {}, npcs: {}, compass: {} }
        fromSectionInfo.main.variables = Object.assign({}, fromSectionInfo.main.variables, objData.main.variables)
        fromSectionInfo.main.compass = Object.assign({}, fromSectionInfo.main.compass, objData.main.compass)

        if (this.templateData.addToFirst) {
          const firstFrom = fromSectionInfo.conversations[questerFrom].first
          if (firstFrom) {
            let pointers = fromSectionInfo.conversations[questerFrom].NPC_options[firstFrom].pointers
            fromSectionInfo.conversations[questerFrom].NPC_options[firstFrom].pointers = `option_${this.templateData.questName}_start,${pointers}`
          }

          const firstTo = toSectionInfo.conversations[questerTo].first
          if (firstTo) {
            let pointers = toSectionInfo.conversations[questerTo].NPC_options[firstTo].pointers
            toSectionInfo.conversations[questerTo].NPC_options[firstTo].pointers = `option_${this.templateData.questName}_done,${pointers}`
          }
        }

        if (this.templateData.addToHologram) {
          let avalible = fromSectionInfo.conditions[`cond_quest_avalible_${questerFrom}`]
          fromSectionInfo.conditions[`cond_quest_avalible_${questerFrom}`] = `${avalible},cond_${this.templateData.questName}_icon1`

          let progress = toSectionInfo.conditions[`cond_quest_progress_${questerTo}`]
          toSectionInfo.conditions[`cond_quest_progress_${questerTo}`] = `${progress},{sectionQuesterFrom}.cond_${this.templateData.questName}_icon2`
          let done = toSectionInfo.conditions[`cond_quest_done_${questerTo}`]
          toSectionInfo.conditions[`cond_quest_done_${questerTo}`] = `${done},{sectionQuesterFrom}.cond_${this.templateData.questName}_icon3`
        }

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
    },
  }
}
</script>
