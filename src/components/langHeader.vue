<template>
  <el-popover
    placement="bottom"
    :title="$t('add-language')"
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
    <el-button type="primary" size="mini" @click="addLang">{{ $t('add') }}</el-button>
  </el-popover>

</template>

<script>

export default {
  emits: ['newLang'],
  data() {
    return {
      newLang: '',
    }
  },
  methods: {
    addLang() {
      if (this.newLang.length === 2) {
        this.$emit('newLang', this.newLang.toLowerCase())
        this.newLang = ''
        this.$refs.languagePopover.hide()
      }
    },
  }
}
</script>
