<template>
  <router-view />
</template>
<script>
export default {
}
</script>
<style>
@import '@mdi/font/css/materialdesignicons.min.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.disable-dbl-tap-zoom {
  touch-action: manipulation;
}
a {
  color: var(--w-success-color);
}
</style>