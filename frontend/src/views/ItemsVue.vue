<template>
    <h2>Items Vue</h2>
    <p>All Items:</p>
    <router-link v-if="this.$route.path.includes('/items/')" :to="{ name: 'AddEditItem' }"></router-link>
    <router-view />
</template>

<script>
export default {
}
</script>