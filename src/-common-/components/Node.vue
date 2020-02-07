<template>
  <div
    class="nodes-wrapper"
    :class="setNodesWrapperClass()">
    <dropdown
      v-if="dropdownOptions.length && item.is_editable"
      :class="{ 'absolute-center': side === 'center' }"
      :items="dropdownOptions"
      @selectItem="selectOption($event)" />
    <div
      v-if="!item.is_editable">
      {{ item.value.value }}
    </div>
    <input
      v-if="!dropdownOptions.length && item.is_editable"
      v-model="item.value.value"
      type="text">
    <div
      v-if="item.children"
      class="child-nodes"
      :class="{ 'center': side === 'center' }">
      <node
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        :side="setChildNodesSide(index)"
        :bubled-option="bubbleOption"
        :step="step"
        @optionChanged="clearOption($event)" />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Node from '@/-common-/components/Node'
import Dropdown from '@/-common-/components/Dropdown'

const cloneDeep = require('lodash.clonedeep')

export default {
  name: 'Node',

  components: { Node, Dropdown },

  props: {
    item: { type: Object },
    side: { type: String },
    bubledOption: { type: Object },
    step: { type: Number }
  },
  
  data () {
    return {
      dropdownOptions: [],
      bubbleOption: null
    }
  },

  watch: {
    item: {
      handler (newVal) {
        console.log('item')
        this.updateChangedOption(newVal)
      },
      deep: true
    },

    bubledOption (newVal) {
      console.log('bubledOption')
      this.updateSelectedOption(newVal)
    }
  },

  created () {
    this.extractOption (this.dropdownOptions, this.item)
  },
  
  methods: {
    setNodesWrapperClass () {
      return this.side
    },
    setChildNodesSide (index) {
      if (this.side !== 'center') return this.side
      return this.item.levelId === 1 && index === 0 ? 'right' : 'left'
    },
    extractOption (options, item) {
      for (let child of item.children) {
        if (!child.value) this.extractOption (options, child)
        else options.push(cloneDeep(child.value))
      }
    },
    selectOption (option) {
      this.dropdownOptions.forEach(el => {
        if (el.is_checked) el.is_checked = false
      })
      option.is_checked = true
      this.item.value = option
      this.bubbleOption = option
      this.$emit('optionChanged', option)
    },
    updateChangedOption (item) {
      const options = []
      this.extractOption (options, item)
      for (let i = 0; i < options.length; i++) {
        if (this.dropdownOptions[i].id === options[i].id) this.dropdownOptions[i].value = options[i].value
      }
    },
    updateSelectedOption (item) {
      let updated = false
      this.dropdownOptions.forEach(option => {
        if (option.id === item.id) {
          option.is_checked = true
          updated = true
        }
      })
      if (updated) {
        this.resetCheckedOptions(item)
        this.item.value = item
        this.bubbleOption = item
      }
    },
    clearOption (item) {
      const valueFound = this.item.children.find(child => {
        if (child.value && this.item.value) return child.value.value === this.item.value.value
        else return undefined
      })
      if (!valueFound) {
        this.resetCheckedOptions(item)
        if (this.item.levelId !== 1) this.$emit('optionChanged', item)
      }
    },
    resetCheckedOptions (item) {
      this.dropdownOptions.forEach(option => {
        if (option.id !== item.id) option.is_checked = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/settings/_module-settings';

.nodes-wrapper {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  @include breakpoint(desktop) {
    padding: 2rem 0;
  }
  &.center {
    position: relative;
    justify-content: center;
  }
  &.left {
    flex-direction: row;
  }
  &.right {
    flex-direction: row-reverse;
  }
  .absolute-center {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .child-nodes {
    &.center {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  }
  input {
    @include fontSizeRem(12, 18);
    text-overflow: ellipsis;
    border-radius: 6px;
    background-color: rgba(36, 41, 55, .1);
    width: 12rem;
    padding: .8rem;
    @include breakpoint(desktop) {
      width: 15rem;
      padding: 1rem;
    }
  }
}
</style>
