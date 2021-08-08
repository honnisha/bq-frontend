<template>
  <div class="setting-section el-row">
    <el-tag type="info" class="setting-header delete-button" @click="deleteSetting(valueKey)"><i class="el-icon-delete"></i></el-tag>

    <el-tag type="info" class="setting-header el-col el-col-4">{{ valueKey }}</el-tag>

    <div v-if="!(localActiveKey === valueKey)" class="setting-value el-col-18" @click="localActiveKey = valueKey">{{ localValue }}</div>

    <div v-else class="field-editor">
      <el-input v-model="localValue"></el-input>
    </div>
  </div>
</template>

<script>

export default {
  props: ['modelValue', 'valueKey', 'activeKey'],
  data() {
    return {
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
    localActiveKey: {
      get() {
        return this.activeKey
      },
      set(value) {
        this.$emit('update:activeKey', value)
      }
    },
  },
  methods: {
    deleteSetting(valueKey) {
      this.$confirm(this.$t('delete-key').replace('{key}', valueKey), this.$t('delete'), {
        confirmButtonText: this.$t('delete'),
        cancelButtonText: this.$t('cancel'),
      }).then(() => {
        this.$emit('delete', valueKey)
      })
    },
  }
}
</script>
