<template>
  <li v-if="firstInCategory">
    <w-flex justify-space-between class="pt2 pb2 pl3 pr3 success-light1--bg white">
      <div>{{ item.category_name }}</div>
    </w-flex>
  </li>
  <li>
    <w-flex v-on:dblclick="lowerItemCount(0)" v-on:click="lowerItemCount(-1)" class="item" justify-space-between
      v-bind:class="{ 'grey-light3': item.count === 0 }">
      <div class="pt2 pb2 pl3 xs10 itemName">{{ item.item_name }}<span v-if="item.count === 0"> - Done!</span></div>
      <div class="xs2 itemCount pr3 pt1">x {{ item.count }}</div>
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
    lowerItemCount(lowerCount) {
      if (this.item.count > 0) {
        axios.patch(process.env.VUE_APP_API_URL + '/api/list_items/' + this.item.list_item_id,
          { count: ((lowerCount === 0) ? 0 : (this.item.count + lowerCount)) },
          { withCredentials: true }
        )
          .then((response) => {
            if (response.status === 200) {
              this.$parent.getListItems();
            }
          })
          .catch(error => {
            if (error.response.status === 401) {
              alert('An Error ocurred obtaining a lists items');
            }
          });
      }
    }
  },
  mounted() {
    this.firstInCategory = this.index === 0 || this.$parent.items[this.index - 1].category_id != this.item.category_id;
  }
}
</script>
<style scoped>
li {
  border-bottom: 1px solid darkgray;
}

.itemCount {
  text-align: right;
}


@keyframes fadeIn {
  0% {
    opacity: 0
  }

  100% {
    opacity: 1;
  }
}

.item {
  cursor: pointer;
  animation: fadeIn 0.3s linear;
  white-space: nowrap;
}

.itemName {
  overflow: hidden;
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

}</style>