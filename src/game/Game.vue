<template>
  <div
    :key="renderKey"
    ref="game"
    class="game">
    <div class="info-panel">
      <template v-if="renderKey === 1">
        <h3>Authoring a bracket</h3>
        <p v-if="!contestants.length">As a game master you should specify a bracket with either 4, 8, or 16 contestants.</p>
        <p v-else>Now, as a game master you can now specify team names and may choose (from dropdowns) a winner of some played games.</p>
      </template>
      <template v-if="renderKey === 2">
        <h3>Playing a bracket game</h3>
        <p>As a player you should now complete a bracket game by selecting a value for its dropdowns.</p>
      </template>
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
            v-if="contestants.length"
            :step="renderKey"
            :item="bracket"
            :contestants="contestants"
            side="center" />
        </div>
      </div>
    </div>
    <div
      v-if="contestants.length"
      class="buttons">
      <btn
        v-if="user === 'game_master'"
        @click="moveForward('player')">
        Play the game (as player)
      </btn>
      <btn
        v-if="user === 'player'"
        @click="moveForward('game_master')">
        Identify the winner (as game master)
      </btn>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Btn from '@/-common-/components/Button'
import Dropdown from '@/-common-/components/Dropdown'
import Node from '@/game/Node'

const cloneDeep = require('lodash.clonedeep')

export default {
  name: 'Game',

  components: { Btn, Dropdown, Node },

  data () {
    return {
      renderKey: 1,
      bracketNumbers: [
        { id: 1, value: 4, levels: 3, is_checked: false },
        { id: 2, value: 8, levels: 4, is_checked: false },
        { id: 3, value: 16, levels: 5, is_checked: false }
      ],
      contestants: []
    }
  },

  computed: {
    user () {
      return this.$store.state.user
    },
    bracket () {
      // console.log(this.$store.state.bracket)
      const initialBracket = {
        levelId: 1,
        is_editable: true,
        value: null,
        children: []
      }
      if (this.user === 'game_master') return cloneDeep(this.$store.state.playedBracket) || initialBracket
      if (this.user === 'player') return cloneDeep(this.$store.state.authBracket) || initialBracket
    }
  },

  created () {
    document.addEventListener('click', this.closeDropdownList)
  },

  beforeDestroy () {
    document.removeEventListener('click', this.closeDropdownList)
  },

  // updated () {
  //   console.log('updated', this.renderKey)
  //   console.log('updated', this.bracketNumbers)
  // },

  methods: {
    closeDropdownList (e) {
      e.stopPropagation()
      const visibleList = document.getElementsByClassName('list is-visible')[0]
      if (visibleList && !e.target.classList.contains('d-target')) visibleList.classList.remove('is-visible')
    },
    createContestants (item) {
      this.bracketNumbers.forEach(el => {
        if (el.id === item.id) el.is_checked = true
      })
      for (let i = 0; i < item.value; i++) {
        const contestant ={
          id: i + 1,
          value: `team-${i + 1}`,
          img: {
            file: null,
            result: null
          },
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
        is_editable: true,
        value: null,
        children: []
      }
      for (let i = 0; i < levels; i++) {
        this.generateTreeStructure(this.bracket, i + 1, child)
      }
      this.detectLowestLevelChildren(lowestLevelChildren, levels, this.bracket.children)
      this.assignValuesToLowestLevelChildren(lowestLevelChildren)
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
    },
    setChildrenEditableStatus (item) {
      if (!item.children.length) return
      for (let child of item.children) {
        if (child.value) child.is_editable = false
        this.setChildrenEditableStatus(child)
      }
    },
    moveForward (user) {
      const bracket = cloneDeep(this.bracket)
      if (bracket.value) bracket.is_editable = false
      this.setChildrenEditableStatus(bracket)
      if (user === 'player') this.$store.commit('setAuthBracket', bracket)
      if (user === 'game_master') this.$store.commit('setPlayedBracket', bracket)
      this.$store.commit('setUser', user)
      this.renderKey++
    }
  }
}
</script>

<style lang="scss">
@import '../-common-/assets/style/settings/_module-settings';

.game {
  width: 100%;
  padding: 1rem;
  @include breakpoint(desktop) {
    width: 185.6rem;
    padding: 3rem 1rem;
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
    width: 160rem;
    height: 65vh;
    @include breakpoint(desktop) {
      width: 100%;
      height: 100%;
    }
  }
  .buttons {
    text-align: center;
  }
}
</style>
