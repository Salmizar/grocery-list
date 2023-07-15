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
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.disable-dbl-tap-zoom {
  touch-action: manipulation;
}
a {
  color: var(--w-success-color);
}

header {
  border-bottom: 1px solid darkgray;
  text-align: center;
  height: 35px;
}
h2 {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
}
</style>