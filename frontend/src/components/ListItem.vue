<template>
  <li v-if="firstInCategory">
    <w-flex justify-space-between class="pt1 pb1 pl3 pr3 success-light1--bg white">
      <div>{{ item.item.category.name }}</div>
    </w-flex>
  </li>
  <li>
    <w-flex justify-space-between v-bind:class="{ 'grey-light3': item.count === 0 }">
      <div class="pt1 pb1 pl3 xs10">{{ item.item.name }}<span v-if="item.count === 0"> - Done!</span></div>
      <div v-on:click="lowerItemCount()" v-if="item.count > 0" class="xs2 itemCount pr3 pt1">x {{ item.count }}</div>
    </w-flex>
  </li>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    firstInCategory: false
  }),
  props: {
    item: Object,
    index: Number
  },
  methods: {
    lowerItemCount() {
      if (this.item.count > 0) {
        axios.patch(process.env.VUE_APP_API_URL + '/api/list_items/' + this.item.list_item_id + '?count=' + (this.item.count - 1),
          {},
          { withCredentials: true }
        )
          .then((response) => {
            if (response.status === 200) {
              this.$parent.getListItems();
            }
          })
          .catch(error => {
            if (error.response.status === 401) {
              //alert('An Error ocurred obtaining a lists items');
            }
          });
      }
    }
  },
  mounted() {
    this.firstInCategory = this.index === 0 || this.$parent.items[this.index - 1].item.category.category_id != this.item.item.category.category_id;
  }
}
</script>
<style scoped>
li {
  border-bottom: 1px solid darkgray;
}

.itemCount {
  text-align: right;
  cursor: pointer;
}

.itemCount:hover {
  border-radius: 10px;
  background-image: linear-gradient(to right, #F7F7F7, #e4e4e4);
}

.itemCount:hover::before {
  content: url("../assets/arrow-down-thick.svg");
  vertical-align: text-bottom;
  display: inline-block;
  width: 14px;
  height: 16px;
  margin-right: 11px;

}
</style>