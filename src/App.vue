<template>
  <div id="app">
    <h1 class="heading">Bracket Game</h1>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import "./-common-/assets/style/main";

#app {
  font-family: 'NunitoRegular', sans-serif;
  color: $font-color;
  @include fontSizeRem(12, 18);
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  @include breakpoint(desktop) {
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      border-radius: 10px;
      background-color: $white;
    }
    &::-webkit-scrollbar {
      width: 1rem;
      background-color: $white;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      background-color: $darkgrey;
    }
  }
  .heading {
    font-family: 'NunitoBold', sans-serif;
    color: $black;
    @include fontSizeRem(20, 40);
    text-align: center;
    padding: 1rem;
    @include breakpoint(desktop) {
      padding: 2rem;
    }
  }
}
</style>
