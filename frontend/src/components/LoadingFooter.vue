<template>
  <footer class="info">
    <div v-if="!props.loading && props.itemsLength === 0">No Items in this list yet.<br /> Click Edit Items to add some.</div>
    <w-progress v-if="props.loading" class="ma1" circle></w-progress>
  </footer>
</template>
<script setup>
  import { defineProps } from 'vue';
  const props = defineProps({
    loading: Boolean,
    itemsLength: Number
  });
</script>
<style>
.info {
  padding-top: 40px;
  text-align: center;
}
</style>