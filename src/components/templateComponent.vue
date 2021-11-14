<template>
  <el-tabs v-model="templateTab">
    <el-tab-pane :label="$t('template-main-tab')">
      
      <el-alert v-if="error" :title="error" class="template-error" type="error"/>

      <el-row class="template-setting">
        <el-col :span="6" class="field-name">{{ $t('template-quest-select-from') }}:</el-col>
        <el-col :span="18" class="field-editor">
          <el-select v-model="questerFrom" placeholder=" ">
            <el-option
              v-for="data in questers"
              :key="`from_${data.quester}`"
              :label="`${data.sectionKey}.${data.quester}`"
              :value="`${data.sectionKey}.${data.quester}`"
            />
          </el-select>
        </el-col>
      </el-row>

      <el-row class="template-setting" v-if="templateInfo.settings.secondNpc">
        <el-col :span="6" class="field-name">{{ $t('template-quest-select-to') }}:</el-col>
        <el-col :span="18" class="field-editor">
          <el-select v-model="questerTo" placeholder=" ">
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

      <template v-for="(settingInfo, settingKey) in templateInfo.variables">
        <el-row class="template-setting">
          <el-tooltip effect="light" placement="left" :content="settingKey">
            <el-col :span="6" class="field-name">{{ settingInfo.title[$root.settings.language] }}:</el-col>
          </el-tooltip>
          <el-col :span="18">
            <el-input class="small-editor" type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="templateData[settingKey]"/>
          </el-col>
        </el-row>
      </template>

      <el-divider/>

      <el-row class="template-setting">
        <el-checkbox v-model="addToHologram">{{ $t('template-add-to-hologram-conditions') }}</el-checkbox>
      </el-row>

      <el-row class="template-setting">
        <el-checkbox v-model="addToFirst">{{ $t('template-add-to-first-message') }}</el-checkbox>
      </el-row>

      <el-row class="template-setting">
        <el-checkbox v-model="addCompass">{{ $t('template-add-compass') }}</el-checkbox>
      </el-row>

      <div class="right-section">
        <el-button type="success" @click="apply">{{ $t('apply') }}</el-button>
      </div>
    </el-tab-pane>

    <el-tab-pane :label="$t('template-preview-tab')" name="preview" lazy>
      <aceEditor :readonly="true" :raw="true" :text="getFormattedYaml()" class="yaml-conversation yaml-editor"/>
    </el-tab-pane>

    <el-tab-pane :label="$t('template-source-tab')" name="source" lazy>
      <el-affix :offset="0">
        <div class="menu-buttons">
          <el-button size="mini" @click="updateSource" type="primary" class="menu-button"><i class="el-icon-document el-icon--right"></i> {{ $t('template-save-source') }}</el-button>
        </div>
      </el-affix>

      <aceEditor :raw="true" v-model="localSourceYaml" class="yaml-conversation yaml-editor"/>
    </el-tab-pane>

  </el-tabs>
</template>

<script>
import aceEditor from "../components/aceEditor.vue"
import yaml from 'js-yaml'

export default {
  components: {
    aceEditor,
  },
  props: ['modelValue', 'sourceYaml'],
  data() {
    return {
      templateTab: null,
      sectionInfo: null,
      templateData: {},
      previewText: '',
      error: null,
      templateInfo: {},
      questerFrom: null,
      questerTo: null,
      questers: [],
      addToHologram: true,
      addToFirst: true,
      addCompass: true,
      localSourceYaml: null,
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
    this.localSourceYaml = this.sourceYaml
    this.prepareFields()
  },
  methods: {
    prepareFields() {
      this.templateData = {}

      for (const [sectionKey, sectionData] of Object.entries(this.projectData)) {
        if (sectionData.conversations) {
          for (const [quester, _] of Object.entries(sectionData.conversations)) {
            this.questers.push({quester: quester , sectionKey: sectionKey})
          }
        }
      }

      this.templateInfo = yaml.load(this.localSourceYaml)['template_info']

      for (const [settingKey, settingInfo] of Object.entries(this.templateInfo.variables)) {
        this.templateData[settingKey] = settingInfo.default
      }
    },
    updateSource() {
      this.prepareFields()
      this.$emit('changeSource', this.localSourceYaml)
    },
    getFormattedYaml() {
      let result = this.localSourceYaml
      for (const [key, value] of Object.entries(this.templateData)) {
        result = result.replaceAll(key, value || '')
      }
      return result
    },
    apply() {
      try {
        this.error = null

        if (!this.questerFrom) {
          this.error = this.$t('no-quester')
          return
        }

        const questName = this.templateData.QUESTNAME

        let objData = yaml.load(this.getFormattedYaml())

        let questerFrom = this.questerFrom.split('.')[1]
        let sectionQuesterFrom = this.questerFrom.split('.')[0]

        const fromSectionInfo = this.projectData[sectionQuesterFrom]

        fromSectionInfo.conversations[questerFrom].NPC_options = Object.assign(
          {}, fromSectionInfo.conversations[questerFrom].NPC_options,
          objData.conversations.from.NPC_options
        )
        fromSectionInfo.conversations[questerFrom].player_options = Object.assign(
          {}, fromSectionInfo.conversations[questerFrom].player_options,
          objData.conversations.from.player_options
        )

        fromSectionInfo.events = Object.assign({}, fromSectionInfo.events, objData.events)
        fromSectionInfo.objectives = Object.assign({}, fromSectionInfo.objectives, objData.objectives)
        fromSectionInfo.conditions = Object.assign({}, fromSectionInfo.conditions, objData.conditions)
        fromSectionInfo.journal = Object.assign({}, fromSectionInfo.journal, objData.journal)
        fromSectionInfo.main.variables = Object.assign({}, fromSectionInfo.main.variables, objData.main.variables)

        if (objData.main.compass) {
          fromSectionInfo.main.compass = Object.assign({}, fromSectionInfo.main.compass, objData.main.compass)
        }

        if (objData.items) {
          fromSectionInfo.items = Object.assign({}, fromSectionInfo.items, objData.items)
        }

        if (!fromSectionInfo.main) fromSectionInfo.main = { variables: {}, npcs: {}, compass: {} }

        if (this.addToFirst) {
          const firstFrom = fromSectionInfo.conversations[questerFrom].first
          if (firstFrom) {
            let pointers = fromSectionInfo.conversations[questerFrom].NPC_options[firstFrom].pointers
            fromSectionInfo.conversations[questerFrom].NPC_options[firstFrom].pointers = `option_${questName}_done,option_${questName}_start,${pointers}`
          }
        }

        if (this.addToHologram) {
          let avalible = fromSectionInfo.conditions[`cond_quest_avalible_${questerFrom}`]
          if (avalible) {
            fromSectionInfo.conditions[`cond_quest_avalible_${questerFrom}`] = `${avalible},cond_${questName}_icon1`
          }

          let progress = fromSectionInfo.conditions[`cond_quest_progress_${questerFrom}`]
          if (progress) {
            fromSectionInfo.conditions[`cond_quest_progress_${questerFrom}`] = `${progress},cond_${questName}_icon1`
          }
          
          let done = fromSectionInfo.conditions[`cond_quest_done_${questerFrom}`]
          if (done) {
            fromSectionInfo.conditions[`cond_quest_done_${questerFrom}`] = `${done},cond_${questName}_icon1`
          }
        }

        if (this.templateInfo.settings.secondNpc) {
          if (!this.questerTo) {
            this.error = this.$t('no-quester-to')
            return
          }

          let questerTo = this.questerTo.split('.')[1]
          let sectionQuesterTo = this.questerTo.split('.')[0]

          const toSectionInfo = this.projectData[sectionQuesterTo]

          toSectionInfo.conversations[questerTo].NPC_options = Object.assign(
            {}, toSectionInfo.conversations[questerTo].NPC_options,
            objData.conversations.to.NPC_options
          )
          toSectionInfo.conversations[questerTo].player_options = Object.assign(
            {}, toSectionInfo.conversations[questerTo].player_options,
            objData.conversations.to.player_options
          )
          
          if (this.addToFirst) {
            const firstTo = toSectionInfo.conversations[questerTo].first
            if (firstTo) {
              let pointers = toSectionInfo.conversations[questerTo].NPC_options[firstTo].pointers
              toSectionInfo.conversations[questerTo].NPC_options[firstTo].pointers = `option_${questName}_done,${pointers}`
            }
          }
          
          if (this.addToHologram) {
            let progress = toSectionInfo.conditions[`cond_quest_progress_${questerTo}`]
            if (progress) {
              toSectionInfo.conditions[`cond_quest_progress_${questerTo}`] = `${progress},{sectionQuesterFrom}.cond_${questName}_icon2`
            }

            let done = toSectionInfo.conditions[`cond_quest_done_${questerTo}`]
            if (done) {
              toSectionInfo.conditions[`cond_quest_done_${questerTo}`] = `${done},{sectionQuesterFrom}.cond_${questName}_icon3`
            }
          }
        }

        this.$message({
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: this.$t('template-applyed').replace('{questName}', questName),
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
