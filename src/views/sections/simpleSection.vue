<template>

  <div class="view-editor-section" v-if="!yamlEdit">
    <div class="menu-buttons">
      <el-button size="mini" @click="changeToYaml" class="menu-button">Yaml editor</el-button>
    </div>

    <template v-for="(item, key) in localValue">
      <simpleField
        v-model="localValue[key]"
        :value-key="key"
        v-model:activeKey="activeKey"
      />
    </template>
  </div>
  
  <div class="yaml-editor-section" v-else>
    <div class="menu-buttons">
      <el-button size="mini" @click="changeToEditor" class="menu-button">Save and return visual editor</el-button>
    </div>

    <el-input
      class="yaml-editor"
      type="textarea"
      :rows="50"
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
  }
}
</script>
