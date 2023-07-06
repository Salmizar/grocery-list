<template>
    <h2>Stores Vue</h2>
    <p>Stores:</p>
    <router-link v-if="this.$route.path.includes('/stores/')" :to="{ name: 'AddEditStore' }"></router-link>
    <router-view />
</template>

<script>
export default {
}
</script>