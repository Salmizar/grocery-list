<template>
    <li v-if="firstInCategory">
        <w-flex justify-space-between class="pt1 pb1 pl3 pr3 success-light1--bg white">
            <div>{{ item.item.category.name }}</div>
        </w-flex>
    </li>
    <li>
        <w-flex justify-space-between class="pt1 pb1 pl3 pr3">
            <div class="xs11">{{ item.item.name }}</div>
            <div style="text-align: right;" class="xs1">x {{ item.count }}</div>
        </w-flex>
    </li>
</template>
<script>
export default {
  data: () => ({
    firstInCategory: false
  }),
  props: {
    item: Object,
    items: Object,
    index: Number
  },
  methods: {

  },
  mounted() {
    this.firstInCategory = this.index===0 || this.items[this.index-1].item.category.category_id != this.item.item.category.category_id;
  }
}
</script>
<style scoped>
li {
    border-bottom:1px solid darkgray;
}
</style>