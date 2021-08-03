<template>
  <div class="lang-header">
    <el-popover
      placement="bottom"
      title="Input language"
      trigger="click"
      popper-class="language-popover"
      ref="languagePopover"
      :show-after="0"
      :hide-after="0"
    >
      <template #reference>
        <el-tag type="info" class="setting-header"><i class="el-icon-plus"></i></el-tag>
      </template>
      <el-input
        v-model="newLang"
        :maxlength="2"
        :minlength="2"
        size="mini"
        class="lang-input"
      >
        <template #prefix>
          <i class="el-icon-s-flag el-input__icon"></i>
        </template>
      </el-input>
      <el-button type="primary" size="mini" @click="addLang">Add</el-button>
    </el-popover>
  </div>

  <el-row class="dialog-setting-section section-lang" v-for="(text, slug) in localValue">
    <el-col :span="2">

      <el-tag type="info" class="setting-header lang-slug" @click="addLang">{{ slug }}</el-tag>
      <el-tag type="info" class="setting-header lang-delete" @click="delLang(slug)"><i class="el-icon-delete"/></el-tag>

    </el-col>
    <el-col :span="22">
      <el-input
        class="lang-editor"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 20}"
        v-model="localValue[slug]"
      />
      </el-col>
  </el-row>

</template>

<script>

export default {
  props: ['modelValue'],
  data() {
    return {
      languagesAvailable: [],
      newLang: '',
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
    addLang() {
      if (this.newLang.length === 2) {
        if (!this.localValue) this.localValue = {}

        this.localValue[this.newLang] = ''
        this.newLang = ''
        this.$refs.languagePopover.hide()
      }
    },
    delLang(slug) {
      this.$confirm(`Delete language ${slug}?`, 'Delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      }).then(() => {
        delete this.localValue[slug]
      })
    },
  }
}
</script>
