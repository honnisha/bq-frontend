<template>

  <el-row class="dialog-setting-section section-lang" v-for="(text, slug) in localValue">
    <el-col :span="spanLeft || 1">

      <el-tag type="info" class="setting-header lang-delete" @click="delLang(slug)">{{ slug }}</el-tag>

    </el-col>
    <el-col :span="spanRight || 23">
      <el-input
        class="small-editor"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 20}"
        v-model="localValue[slug]"
      />
      </el-col>
  </el-row>

</template>

<script>

export default {
  props: ['modelValue', 'spanLeft', 'spanRight'],
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
  },
  created() {
    if (typeof this.localValue === 'string') {
      const newLang = {}
      newLang[this.$root.settings.language] = this.localValue
      this.localValue = newLang
    }
  },
  methods: {
    delLang(slug) {
      this.$confirm(this.$t('delete-language').replace('{language}', slug), this.$t('delete'), {
        confirmButtonText: this.$t('delete'),
        cancelButtonText: this.$t('cancel'),
      }).then(() => {
        delete this.localValue[slug]
      })
    },
  }
}
</script>
