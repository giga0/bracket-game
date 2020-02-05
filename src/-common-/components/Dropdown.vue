<template>
  <div class="dropdown">
    <div
      class="wrapper"
      @click="onClick">
      <button class="selected">
        <span>{{ selected }}</span>
        <div class="triangle"></div>
      </button>
      <div
        ref="list"
        class="list">
        <ul>
          <li
            v-for="item in items"
            :key="item.id"
            :class="{ 'is-checked': item.is_checked }"
            @click="$emit('selectItem', item)">
            {{ item.value }}
            <span class="checkmark">
              &check;
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',

  props: {
    items: { type: Array }
  },

  data () {
    return {
      listIsVisible: false
    }
  },

  computed: {
    selected () {
      const selected = this.items.find(item => item.is_checked)
      return selected ? selected.value : '-'
    }
  },

  methods: {
    onClick () {
      if (this.$refs.list) {
        if (!this.$refs.list.classList.contains('is-visible')) {
          const visibleLists = document.getElementsByClassName('list is-visible')
          if (visibleLists.length) visibleLists[0].classList.remove('is-visible')
        }
        this.$refs.list.classList.toggle('is-visible')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/settings/_module-settings';

.dropdown {
  position: relative;
  @include breakpoint(desktop) {
    display: inline-flex;
    align-items: center;
  }
  .wrapper {
    position: relative;
  }
  .label {
    line-height: 1.23;
    font-weight: bold;
    color: $black;
    display: inline-block;
    margin-right: 1.5rem;
    @include breakpoint(desktop) {
      margin-right: 1.7rem;
    }
  }
  .selected {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 6px;
    background-color: rgba(36, 41, 55, .1);
    width: 12rem;
    padding: .5rem 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    @include breakpoint(desktop) {
      width: 15rem;
    }
    @include breakpoint(desktop) {
      transition: all .25s ease;
      &:hover {
        background-color: rgba(36, 41, 55, .3);
      }
    }
    .triangle {
      display: inline-block;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: .5rem .5rem 0 .5rem;
      border-color: $black transparent transparent transparent;
    }
    span {
      color: $font-color;
      font-family: 'NunitoRegular';
      @include fontSizeRem(12, 18);
      line-height: 2;
      letter-spacing: -0.33px;
      color: $black;
      display: inline-block;
      margin-right: .8rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .list {
    visibility: hidden;
    opacity: 0;
    overflow: hidden;
    width: 100%;
    position: absolute;
    bottom: -.5rem;
    border-radius: 9px;
    box-shadow: 0 4px 8px 0 rgba(36, 41, 56, 0.1);
    border: 1px solid $darkgrey;
    background-color: $white;
    transition: all .25s ease-in-out;
    &.is-visible {
      visibility: visible;
      opacity: 1;
    }
    ul {
      overflow-y: auto;
      z-index: 1;
      position: relative;
      background-color: $white;
      max-height: 20rem;
      padding: 1rem 1.5rem;
      @include breakpoint(desktop) {
        max-height: 25rem;
      }
      &::-webkit-scrollbar {
        width: .4rem;
        background-color: $white;
      }
      &::-webkit-scrollbar-thumb {
        width: .4rem;
        border-radius: 2px;
        background-color: #e8e8e8;
      }
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        cursor: pointer;
        &:last-child {
          margin-bottom: 0;
        }
        &.is-checked {
          .checkmark {
            opacity: 1;
          }
        }
        .checkmark {
          display: inline-block;
          margin-left: 1rem;
          opacity: 0;
        }
      }
    }
  }
}
</style>
