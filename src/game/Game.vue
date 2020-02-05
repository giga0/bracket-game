<template>
  <div class="game">
    <div class="info-panel">
      <h3>Authoring a bracket</h3>
      <p v-if="!contestants.length">As a game master you should specify a bracket with either 4, 8, or 16 contestants.</p>
      <p v-else>Now, as a game master you can now specify team names and may choose (from dropdowns) a winner of some played games.</p>
    </div>
    <div class="game-panel">
      <div
        v-if="!contestants.length"
        class="bracket-number">
        <dropdown
          :items="bracketNumbers"
          @selectItem="createContestants($event)" />
      </div>
      <div class="scroll-container">
        <div class="bracket-wrapper">
          <node
            v-if="test"
            :item="bracket"
            side="center" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Btn from '@/-common-/components/Button'
import Dropdown from '@/-common-/components/Dropdown'
import Node from '@/-common-/components/Node'

const cloneDeep = require('lodash.clonedeep')

export default {
  name: 'Game',

  components: { Btn, Dropdown, Node },

  data () {
    return {
      bracketNumbers: [
        { id: 1, value: 4, levels: 3, is_checked: false },
        { id: 2, value: 8, levels: 4, is_checked: false },
        { id: 3, value: 16, levels: 5, is_checked: false }
      ],
      contestants: [],
      bracket: {
        levelId: 1,
        value: null,
        children: []
      },
      test: false
    }
  },

  methods: {
    createContestants (item) {
      this.bracketNumbers.forEach(el => {
        if (el.id === item.id) el.is_checked = true
      })
      for (let i = 0; i < item.value; i++) {
        const contestant ={
          id: i + 1,
          value: `team-${i + 1}`,
          img: null,
          is_checked: false
        }
        this.contestants.push(contestant)
      }
      this.createBracket(item.levels)
    },
    createBracket (levels) {
      const lowestLevelChildren = []
      const child = {
        levelId: null,
        value: null,
        children: []
      }
      for (let i = 0; i < levels; i++) {
        this.generateTreeStructure(this.bracket, i + 1, child)
      }
      this.detectLowestLevelChildren(lowestLevelChildren, levels, this.bracket.children)
      this.assignValuesToLowestLevelChildren(lowestLevelChildren)
      this.test = true
      // console.log(lowestLevelChildren)
    },
    generateTreeStructure (bracket, level, child) {
      child.levelId = level
      if (level > 1) {
        if (bracket.children.length === 2) {
          for (let item of bracket.children) {
            this.generateTreeStructure(item, level, child)
          }
        } else {
          bracket.children.push(cloneDeep(child))
          bracket.children.push(cloneDeep(child))
        }
      }
    },
    detectLowestLevelChildren (lowestLevelChildren, lowestLevel, children) {
      for (let child of children) {
        if (child.levelId === lowestLevel) lowestLevelChildren.push(child)
        else this.detectLowestLevelChildren(lowestLevelChildren, lowestLevel, child.children)
      }
    },
    assignValuesToLowestLevelChildren (lowestLevelChildren) {
      for (let i = 0; i < lowestLevelChildren.length; i++) {
        lowestLevelChildren[i].value = this.contestants[i]
      }
    }
  }
}
</script>

<style lang="scss">
@import '../-common-/assets/style/settings/_module-settings';

.game {
  width: 100%;
  padding: 3rem 1rem 0;
  @include breakpoint(desktop) {
    width: 144rem;
    margin: 0 auto;
  }
  .info-panel {
    @include breakpoint(desktop) {
      text-align: center;
    }
    h3 {
      @include fontSizeRem(16, 26);
      margin-bottom: 1rem;
    }
  }
  .game-panel {
    .bracket-number {
      display: flex;
      justify-content: center;
      margin-top: 1rem;
    }
  }
  .scroll-container {
    overflow: scroll;
    @include breakpoint(desktop) {
      overflow: inherit;
    }
  }
  .bracket-wrapper {
    width: 120rem;
    height: 75vh;
    @include breakpoint(desktop) {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
