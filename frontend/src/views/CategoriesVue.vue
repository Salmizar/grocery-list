<template>
    <h2>Categories Vue</h2>
    <p>The Categories:</p>
    <router-link v-if="this.$route.path.includes('/categories/')" :to="{ name: 'AddEditCategory' }"></router-link>
    <router-view />
</template>

<script>
export default {
}
</script>