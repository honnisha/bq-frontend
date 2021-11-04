<template>

  <el-affix :offset="0">
    <div class="menu-buttons">
      <el-button size="mini" @click="openMenu" class="menu-button"><i class="el-icon-plus el-icon--right"></i> {{ $t('create-item') }}</el-button>
    </div>
  </el-affix>

  <aceEditor v-model="data" :class="class" :key="aceEditorKey" />

  <el-dialog
    :title="$t('create-item-dialog')"
    v-model="itemMenuVisible"
    width="30%"
    custom-class="create-section-dialog"
    :close-on-click-modal="false"
  >
    <el-alert v-if="newItemError" :title="newItemError" type="error"/>

    <div class="dialog-subsection">
      <span>{{ $t('newitem-settingName') }}</span>
      <el-input v-model="newItem.settingName"></el-input>
    </div>

    <div class="dialog-subsection">
      <span>{{ $t('newitem-material') }}</span>
      <el-input v-model="newItem.material"></el-input>
    </div>

    <div class="dialog-subsection">
      <span>{{ $t('newitem-cmd') }}</span>
      <el-input v-model="newItem.cmd"></el-input>
    </div>

    <div class="dialog-subsection">
      <span>{{ $t('newitem-name') }}</span>
      <el-input v-model="newItem.name"></el-input>
    </div>

    <div class="dialog-subsection">
      <span>{{ $t('newitem-lore') }}</span>
      <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 20}" v-model="newItem.lore"/>
    </div>

    <div class="dialog-subsection">
      <el-checkbox v-model="newItem.questItemsunbreakable">{{ $t('newitem-quest-items-unbreakable') }}</el-checkbox>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="itemMenuVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="createItem">{{ $t('create') }}</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script>
import aceEditor from "../components/aceEditor.vue"

export default {
  props: ['modelValue', 'class'],
  components: {
    aceEditor,
  },
  data() {
    return {
      aceEditorKey: 0,
      itemMenuVisible: false,
      newItemError: null,
      newItem: {},
      defaultItemSettings: {
        settingName: 'name',
        material: 'paper',
        cmd: null,
        name: null,
        lore: '&ftext\n&2Предмет_для_задания',
        questItemsunbreakable: true,
      }
    }
  },
  computed: {
    data: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
  },
  methods: {
    openMenu() {
      this.newItem = this.defaultItemSettings
      this.itemMenuVisible = true
    },
    createItem() {
      this.newItemError = null

      if (this.data[this.newItem.settingName]) {
        this.newItemError = this.$t('newitem-already-exists').replace('{settingName}', this.newItem.settingName)
        return
      }

      let newLine = `${this.newItem.material}`
      if (this.newItem.cmd) {
        newLine += ` custom-model-data:${this.newItem.cmd}`
      }
      if (this.newItem.name) {
        newLine += ` name:${this.newItem.name}`
      }
      if (this.newItem.lore) {
        let lore = this.newItem.lore.replaceAll(' ', '_').replaceAll('\n', ';')
        newLine += ` lore:${lore}`
      }
      if (this.newItem.questItemsunbreakable) {
        newLine += ` quest_items_unbreakable:true`
      }
      this.data[this.newItem.settingName] = newLine
      this.itemMenuVisible = false
      this.aceEditorKey += 1
    }
  }
}
</script>
