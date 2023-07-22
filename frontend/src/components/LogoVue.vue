<template>
  <header>
    <h2>My Grocery List</h2>
    <router-link :to="{ name: 'Login' }"><img alt="App logo" width="48" height="65"
        src="../assets/logo.png" /></router-link>
  </header>
</template>
<style scoped>
header {
  height: auto;
  border-bottom: 0px;
}

h2 {
  position: relative;
  padding-top: 15px;
}
</style>