<template>
    <footer class="info">
        <div v-if="!loading && itemsLength === 0">No Items in this list yet.<br /> Click Edit Items to add some.</div>
        <w-progress v-if="loading" class="ma1" circle></w-progress>
    </footer>
</template>
<script>
export default {
    props: {
      loading: Boolean,
      itemsLength: Number
    }
}

</script>
<style>
.info {
  padding-top: 40px;
  text-align: center;
}
</style>