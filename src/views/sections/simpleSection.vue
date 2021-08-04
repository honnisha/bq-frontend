<template>

  <div class="view-editor-section" v-if="!yamlEdit">
    <div class="menu-buttons">
      <el-button size="mini" @click="changeToYaml" class="menu-button">{{ this.$t('yaml-editor') }}</el-button>
      <el-button size="mini" @click="newSetting" class="menu-button" type="success" icon="el-icon-plus" plain>{{ $t('new-setting') }}</el-button>
    </div>

    <template v-for="(item, key) in localValue">
      <simpleField
        v-model="localValue[key]"
        :value-key="key"
        v-model:activeKey="activeKey"
        @delete="deleteSetting"
      />
    </template>
  </div>
  
  <div class="yaml-editor-section" v-else>
    <div class="menu-buttons">
      <el-button size="mini" @click="changeToEditor" class="menu-button">{{ this.$t('save-and-return') }}</el-button>
    </div>

    <el-input
      class="yaml-editor"
      type="textarea"
      :autosize="{ minRows: 20, maxRows: 50}"
      v-model="yamlText"
    />
  </div>

</template>

<script>
import yaml from  'js-yaml'
import simpleField from "../fields/simpleField.vue";

export default {
  components: {
    simpleField,
  },
  props: ['modelValue'],
  data() {
    return {
      yamlEdit: false,
      yamlText: null,
      activeKey: '',
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
    deleteSetting(valueKey) {
      delete this.localValue[valueKey]
    },
    newSetting() {
      this.$prompt(this.$t('new-setting-key'), this.$t('create'), {
        confirmButtonText: this.$t('create'),
        cancelButtonText: this.$t('cancel'),
        inputPattern: /^[a-zA-Z0-9_]+$/,
        inputErrorMessage: this.$t('exists-regex'),
        inputValidator: value => !this.localValue[value],
      }).then(({ value }) => {
        this.localValue[value] = ''
      })
    },
  }
}
</script>
