<template functional>
  <button :style="{ backgroundColor: props.color }"
    @click="listeners.click">
    <slot/>
  </button>
</template>

<script>
export default {
  name: 'Button',
  
  props: {
    color: { type: String }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/settings/_module-settings';

button {
  @include fontSizeRem(12, 18);
  color: $white;
  background-color: $blue;
  padding: .8rem;
  border-radius: 15px;
  @include breakpoint(desktop) {
    padding: 1.2rem;
    &:hover {
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
