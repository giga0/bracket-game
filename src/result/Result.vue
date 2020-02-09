<template>
  <div class="result">
    <p>The game is completed and...</p>
    <p class="success" v-if="bracketValuesEqual">The player won!</p>
    <p class="fail" v-else>The player lost :(</p>
  </div>
</template>

<script>
export default {
  name: 'Result',

  beforeRouteEnter (to, from, next) {
    if (from.name === 'Game') next()
    else next('/')
  },

  computed: {
    authBracketValues () {
      return this.$store.getters.getAuthBracketValues
    },
    playedBracketValues () {
      return this.$store.getters.getPlayedBracketValues
    },
    bracketValuesEqual () {
      for (let i = 0; i < this.authBracketValues.length; i++) {
        if (this.authBracketValues[i] !== this.playedBracketValues[i]) return false
      }
      return true
    }
  }
}
</script>

<style lang="scss">
@import '../-common-/assets/style/settings/_module-settings';

.result {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translateX(-50%);
  p {
    @include fontSizeRem(14, 22);
    padding: .5rem 0;
    &.success {
      color: $green;
    }
    &.fail {
      color: $red;
    }
  }
}
</style>
