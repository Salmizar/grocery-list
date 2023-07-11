<template>
  <li v-if="firstInCategory">
    <w-flex justify-space-between class="pt2 pb2 pl3 pr3 success-light1--bg white">
      <div>{{ categoryName }}</div>
    </w-flex>
  </li>
  <w-transition-expand y>
    <li v-if="showItem()">
      <w-flex class="item" justify-space-between v-bind:class="{ 'itemDone grey-light3': item.count === 0 }">
        <div v-on:click="setItemCount(-1)" class="pt2 pb2 pl3 xs10 itemName">
          {{ itemName }}
          <span v-if="item.count === 0"> - Done</span>
        </div>
        <w-transition-slide left>
          <div v-on:dblclick="setItemCount(0)" v-if="(item.count > 0)" class="xs2 itemCount pr3 pt2">x {{ item.count }}
          </div>
        </w-transition-slide>
      </w-flex>
    </li>
  </w-transition-expand>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    firstInCategory: false,
    categoryName: '',
    itemName: '',
    newCount: 0,
    updateCountTimeout: 0
  }),
  props: {
    item: Object,
    index: Number,
    showDone: Boolean,
    storeFilter: Number
  },
  methods: {
    showItem() {
      if (this.storeFilter>0) {
        return this.item.item.store_ids.indexOf(this.storeFilter)>-1 && (this.item.count > 0 || this.showDone) 
      } else {
        return this.item.count > 0 || this.showDone;
      }
    },
    updateItemCount() {
      axios.patch(process.env.VUE_APP_API_URL + '/api/list_items/' + this.item.list_item_id,
        { count: this.newCount },
        { withCredentials: true }
      )
        .then((response) => {
          if (response.status === 200) {
            this.$parent.updateItem(this.index, { count: response.data[1].count });
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            alert('An Error ocurred obtaining a lists items');
          }
        });
    },
    setItemCount(lowerCount) {
      if (this.item.count > 0) {
        this.newCount = ((lowerCount === 0) ? 0 : (this.item.count + lowerCount));
        this.$parent.updateItem(this.index, { count: this.newCount });
        this.updateObjs();
        clearTimeout(this.updateCountTimeout);
        this.updateCountTimeout = setTimeout(() => { this.updateItemCount() }, 2000);
      }
    },
    updateObjs() {
      if (this.item && this.item.item) {
        this.categoryName = this.item.item.category.name;
        this.itemName = this.item.item.name;
        this.firstInCategory = this.index === 0 || this.$parent.items[this.index - 1].item.category.category_id != this.item.item.category.category_id;
      }
    }
  },
  mounted() {
    this.updateObjs();
  }
}
</script>
<style scoped>
li {
  border-bottom: 1px solid darkgray;
}

.itemCount {
  text-align: right;
  width: 60px;
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
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.item:hover {
  background-color: #F5F5F5;
}

.itemDone {
  cursor: default;
}

.itemName {
  overflow: hidden;
  white-space: nowrap;
}

.itemCount:hover {
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