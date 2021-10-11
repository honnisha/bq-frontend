<template>

  <el-affix :offset="0">
    <div class="menu-buttons">
      <el-button size="mini" @click="useDarkTheme" class="menu-button"><i class="el-icon-view el-icon--right"></i> {{ $t('use-dark-theme') }}</el-button>
    </div>
  </el-affix>

  <aceEditor v-model="text" :class="class"/>

</template>

<script>
import aceEditor from "../components/aceEditor.vue"

export default {
  props: ['modelValue', 'class'],
  components: {
    aceEditor,
  },
  computed: {
    text: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
  },
  methods: {
    useDarkTheme() {
      this.$root.settings.dark = !this.$root.settings.dark
      this.$root.settings = this.$root.settings
    },
  }
}
</script>
