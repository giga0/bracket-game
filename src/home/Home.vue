<template>
  <div class="home">
    <p>The game have three Milestones:</p>
    <ul>
      <li>Authoring a bracket (Game Master)</li>
      <li>Playing a bracket game (Player)</li>
      <li>Identify the winning bracket (Game Master)</li>
    </ul>
    <div class="buttons">
      <btn @click="startGame">Start the game</btn>
    </div>
  </div>
</template>

<script>
import Btn from '@/-common-/components/Button'

export default {
  name: 'Home',

  components: { Btn },

  methods: {
    startGame () {
      this.$router.push({ name: 'Game' });
    }
  }
}
</script>

<style lang="scss">
@import '../-common-/assets/style/settings/_module-settings';

.home {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @include breakpoint(desktop) {
    width: auto;
  }
  ul {
    margin: 1rem 0 0 2rem;
    @include breakpoint(desktop) {
      margin: 1rem 0 0 3rem;
    }
    li {
      list-style: disc;
      margin-top: .5rem;
    }
  }
  .buttons {
    display: flex;
    justify-content: center;
    margin-top: 3rem;
  }
}
</style>
