<template>
  <div
    :key="renderKey"
    class="game">
    <div class="info-panel">
      <template v-if="renderKey === 1">
        <h3>Authoring a bracket</h3>
        <p v-if="!contestants.length">As a game master, you should specify a bracket with either 4, 8, or 16 contestants.</p>
        <p v-else>Now, as a game master, you can specify team names/logos and may choose (from dropdowns) a winner for some played games.</p>
      </template>
      <template v-if="renderKey === 2">
        <h3>Playing a bracket game</h3>
        <p>As a player, you should now complete a bracket game by selecting a value for its dropdowns.</p>
      </template>
      <template v-if="renderKey === 3">
        <h3>Identify the winning bracket</h3>
        <p>As a game master, you should now complete the authored bracket by selecting a value for its dropdowns.</p>
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
      <div
        class="scroll-container"
        :class="{ 'scroll-container--small': contestants.length === 4 }">
        <div class="bracket-wrapper">
          <node
            v-if="contestants.length"
            :item="bracket"
            :contestants="contestants"
            side="center"
            @checkSubmitValidity="checkSubmitValidity" />
        </div>
      </div>
    </div>
    <div
      v-if="contestants.length"
      class="buttons">
      <btn
        :disabled="isSubmitDisabled"
        @click="moveForward(renderKey === 1 ? 'player' : 'game_master')">
        <template v-if="renderKey === 1">
          Finish authoring the bracket
        </template>
        <template v-if="renderKey === 2">
          Submit the bracket
        </template>
        <template v-if="renderKey === 3">
          Identify the winning bracket
        </template>
      </btn>
    </div>
  </div>
</template>

<script>
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
      contestants: [],
      isSubmitDisabled: false
    }
  },

  computed: {
    user () {
      return this.$store.state.user
    },
    bracket () {
      let bracket
      const initialBracket = {
        levelId: 1,
        is_editable: true,
        value: null,
        children: []
      }
      if (this.user === 'game_master') bracket = cloneDeep(this.$store.state.authBracket) || initialBracket
      if (this.user === 'player') bracket = cloneDeep(this.$store.state.authBracket)
      return bracket
    }
  },

  created () {
    document.addEventListener('click', this.closeDropdownList)
  },

  beforeDestroy () {
    document.removeEventListener('click', this.closeDropdownList)
  },

  methods: {
    closeDropdownList (e) {
      e.stopPropagation()
      const visibleList = document.getElementsByClassName('list is-visible')[0]
      if (visibleList && !e.target.classList.contains('d-target')) visibleList.classList.remove('is-visible')
    },
    createContestants (item) {
      item.is_checked = true
      for (let i = 0; i < item.value; i++) {
        const contestant = {
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
      const child = {
        levelId: null,
        is_editable: true,
        value: null,
        children: []
      }
      const contestantsDummy = new Array(this.contestants.length)
      for (let i = 0; i < levels; i++) {
        this.generateTreeStructure(this.bracket, i + 1, child, levels, contestantsDummy)
      }
    },
    generateTreeStructure (bracket, level, child, lowestLevel, contestantsDummy) {
      child.levelId = level
      if (level > 1) {
        if (bracket.children.length === 2) {
          for (let item of bracket.children) {
            this.generateTreeStructure(item, level, child, lowestLevel, contestantsDummy)
          }
        } else {
          for (let i = 0; i < 2; i++) {
            const childClone = cloneDeep(child)
            if (level === lowestLevel) {
              childClone.value = this.contestants[this.contestants.length - contestantsDummy.length]
              contestantsDummy.shift()
            }
            bracket.children.push(childClone)
          }
        }
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
      if (this.renderKey === 3 && user === 'game_master') {
        this.$store.commit('setAuthBracket', bracket)
        this.$router.push({ name: 'Result' })
        return
      }
      if (user === 'player') this.$store.commit('setAuthBracket', bracket)
      if (user === 'game_master') this.$store.commit('setPlayedBracket', bracket)
      this.$store.commit('setUser', user)
      this.renderKey++
      this.checkSubmitValidity()
    },
    checkSubmitValidity () {
      if (this.renderKey === 1) return
      const values = []
      this.gatherValues(this.bracket, values)
      this.isSubmitDisabled = values.includes(null)
    },
    gatherValues (item, values) {
      values.push(item.value)
      if (item.children.length) {
        for (let child of item.children) {
          this.gatherValues(child, values)
        }
      }
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
    &--small {
      padding-top: 3rem;
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
