<template>
  <div
    class="nodes-wrapper"
    :class="side">
    <div class="contestant-wrapper">
      <div class="logo-upload">
        <template v-if="!item.children.length && item.is_editable">
          <input
            :id="`logoUpload-${item.value.id}`"
            type="file"
            accept=".png, .jpg, .jpeg"
            @change="onLogoChange" />
          <label
            :for="`logoUpload-${item.value.id}`"
            class="logo-preview">
            <div
              :style="{ backgroundImage: `url(${item.value && item.value.img.result
                ? item.value.img.result
                : 'https://www.freeiconspng.com/uploads/shield-png-26.png'})`
              }"
            />
          </label>
        </template>
        <div
          v-else
          class="logo-preview">
          <div
            :style="{ backgroundImage: `url(${item.value && item.value.img.result
              ? item.value.img.result
              : 'https://www.freeiconspng.com/uploads/shield-png-26.png'})`
            }"
          />
        </div>
      </div>
      <div
        v-if="!item.is_editable"
        class="contestant-name contestant-name--read-only">
        {{ item.value.value }}
      </div>
      <dropdown
        v-if="dropdownOptions.length && item.is_editable"
        :items="dropdownOptions"
        @selectItem="selectOption($event)" />
      <input
        v-if="!dropdownOptions.length && item.is_editable"
        v-model="item.value.value"
        type="text"
        class="contestant-name">
    </div>
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
        :contestants="contestants"
        @optionChanged="clearOption($event)"
        @checkSubmitValidity="$emit('checkSubmitValidity')" />
    </div>
  </div>
</template>

<script>
import Node from '@/game/Node'
import Dropdown from '@/-common-/components/Dropdown'

const cloneDeep = require('lodash.clonedeep')

export default {
  name: 'Node',

  components: { Node, Dropdown },

  props: {
    item: { type: Object },
    side: { type: String },
    bubledOption: { type: Object },
    contestants: { type: Array }
  },
  
  data () {
    return {
      dropdownOptions: [],
      bubbleOption: null
    }
  },

  watch: {
    item: {
      handler () {
        this.updateChangedOption()
      },
      deep: true
    },
    bubledOption (newVal) {
      this.updateSelectedOption(newVal)
    }
  },

  created () {
    this.extractOption (this.dropdownOptions, this.item)
  },
  
  methods: {
    setChildNodesSide (index) {
      if (this.side !== 'center') return this.side
      return this.item.levelId === 1 && index === 0 ? 'right' : 'left'
    },
    extractOption (options, item) {
      for (let child of item.children) {
        if (!child.value) this.extractOption (options, child)
        else {
          const value = cloneDeep(child.value)
          value.is_checked = false
          options.push(value)
        }
      }
    },
    selectOption (option) {
      for (let el of this.dropdownOptions) {
        if (el.is_checked) {
          el.is_checked = false
        }
      }
      option.is_checked = true
      this.item.value = option
      this.bubbleOption = option
      this.$emit('optionChanged', option)
      this.$emit('checkSubmitValidity')
    },
    updateChangedOption () {
      for (let option of this.dropdownOptions) {
        for (let contestant of this.contestants) {
          if (contestant.id === option.id) {
            if (contestant.value !== option.value) option.value = contestant.value
            if (contestant.img.result !== option.img.result) option.img.result = contestant.img.result
            break
          }
        }
      }
    },
    updateSelectedOption (item) {
      if (!item) return
      let updated = false
      for (let option of this.dropdownOptions) {
        if (option.id === item.id) {
          option.is_checked = true
          updated = true
          break
        }
      }
      if (updated) {
        this.resetCheckedOptions(item)
        this.item.value = item
        this.bubbleOption = item
        this.$emit('checkSubmitValidity')
      }
    },
    clearOption (item) {
      const valueFound = this.item.children.find(child => this.item.value && child.value && this.item.value.id === child.value.id)
      if (!valueFound) {
        this.item.value = null
        this.bubbleOption = null
        this.resetCheckedOptions(item)
        if (this.item.levelId !== 1) this.$emit('optionChanged', item)
      }
      this.$emit('checkSubmitValidity')
    },
    resetCheckedOptions (item) {
      for (let option of this.dropdownOptions) {
        if (option.id !== item.id) {
          option.is_checked = false
        }
      }
    },
    onLogoChange (e) {
      if (!e.target.files || !e.target.files[0]) return
      const reader = new FileReader()
      reader.onload = e => this.item.value.img.result = e.target.result
      reader.readAsDataURL(e.target.files[0]);
      this.item.value.img.file = e.target.files[0]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../-common-/assets/style/settings/_module-settings';

.nodes-wrapper {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  @include breakpoint(desktop) {
    padding: 2rem 0;
  }
  .child-nodes {
    &.center {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  }
  .contestant-wrapper {
    display: flex;
    align-items: center;
    .contestant-name {
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
      &--read-only {
        padding: 1.2rem .8rem;
        @include breakpoint(desktop) {
          padding: 1.4rem 1rem;
        }
      }
    }
    .logo-upload {
      input {
        display: none;
      }
      .logo-preview {
        width: 3rem;
        height: 3rem;
        position: relative;
        border-radius: 100%;
        border: 2px solid #F8F8F8;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        @include breakpoint(desktop) {
          width: 3.6rem;
          height: 3.6rem;
        }
        > div {
          width: 100%;
          height: 100%;
          border-radius: 100%;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }
      }
      label.logo-preview {
        border-color: $blue;
        display: block;
        cursor: pointer;
        transition: border-color .2s ease;
        &:hover {
          border-color: lighten($blue, 30%);
        }
      }
    }
  }
  &.center {
    position: relative;
    justify-content: center;
    > .contestant-wrapper {
      position: absolute;
      top: 45%;
      transform: translateY(-50%);
      &::after {
        content: 'winner';
        position: absolute;
        bottom: -55%;
        left: 50%;
        transform: translate(-10%, -10%);
      }
      .logo-upload {
        margin-right: 1rem;
      }
    }
  }
  &.left {
    flex-direction: row;
    .contestant-wrapper {
      flex-direction: row-reverse;
      .logo-upload {
        margin-left: 1rem;
      }
    }
  }
  &.right {
    flex-direction: row-reverse;
    .contestant-wrapper {
      .logo-upload {
        margin-right: 1rem;
      }
    }
  }
}
</style>
