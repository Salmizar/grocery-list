<template>
  <li v-if="firstInCategory">
    <w-flex justify-space-between class="pt2 pb2 pl3 pr3 success-light1--bg white categories">
      <div class="xs10 shrink">{{ item.category_name }}</div>
      <div class="xs2 mr10">In&nbsp;List</div>
    </w-flex>
  </li>
  <li>
    <w-flex class="item" justify-space-between>
      <div v-on:click="setItemCount(+1)" v-bind:class="{ 'grey-light3 itenNameMissing': hasItems }"
        class="xs10 pt2 pb2 pl3 itemName" title="Add an Item">
        {{ item.item_name }}
      </div>
      <w-transition-slide left>
        <div title="Add an Item" v-on:click="setItemCount(+1)" v-bind:class="{ 'grey-light3': hasItems }" v-if="hasItems"
          class="black xs1 pt2 pb2 pl3 itemCount">x {{ item.count }}</div>
      </w-transition-slide>
      <w-transition-slide left>
        <div v-on:click="setItemCount(-1)" v-if="hasItems" class="xs1 pl2 itemActions" title="Remove an Item">
          <w-icon lg>mdi mdi-delete</w-icon>
        </div>
      </w-transition-slide>
    </w-flex>
  </li>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    firstInCategory: false,
    hasItems: false,
    newCount: 0,
    updateCountTimeout: 0
  }),
  props: {
    item: Object,
    index: Number
  },
  methods: {
    updateItemCount() {
      if (this.newCount === 0) {
        axios.delete(process.env.VUE_APP_API_URL + '/api/list_items/' + this.item.list_item_id,
          { withCredentials: true }
        )
          .then((response) => {
            if (response.status === 200) {
              this.$parent.updateItem(this.index, { count: null, list_item_id: null });
            }
          })
          .catch(error => {
            if (error.response.status === 401) {
              alert('An Error ocurred obtaining a lists items');
            }
          });
      } else {
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
      }
    },
    setItemCount(incriment) {
      if (this.hasItems || this.item.count === 0) {
        this.newCount = this.item.count + incriment;
        this.$parent.updateItem(this.index, { count: this.newCount });
        this.updateObjs();
        clearTimeout(this.updateCountTimeout);
        this.updateCountTimeout = setTimeout(() => { this.updateItemCount() }, 500);
      } else {
        axios.post(process.env.VUE_APP_API_URL + '/api/list_items/',
          { list_id: this.$parent.list_id, item_id: this.item.item_id, count: 1 },
          { withCredentials: true }
        )
          .then((response) => {
            if (response.status === 200) {
              this.$parent.updateItem(this.index, response.data);
              this.updateObjs();
            }
          })
          .catch(error => {
            if (error.response.status === 401) {
              alert('An Error ocurred obtaining a lists items');
            }
          });

      }
    },
    updateObjs() {
      this.hasItems = (this.item.count != null && this.item.count > 0);
      this.firstInCategory = this.index === 0 || this.$parent.items[this.index - 1].category_id != this.item.category_id;
    }
  },
  mounted() {
    this.updateObjs();
  }
}
</script>
<style scoped>
@keyframes fadeIn {
  0% {
    opacity: 0
  }

  100% {
    opacity: 1;
  }
}

.categories div {
  display: inline-block;
  white-space: hidden;
}

.categories {
  overflow: hidden;
  white-space: nowrap;
  display: block;
}

li {
  border-bottom: 1px solid darkgray;
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

.itemName {
  overflow: hidden;
  white-space: nowrap;
  display: block;
}

.itemName div {
  display: inline-block;
  white-space: hidden;
}

.itemName:hover::after {
  content: url("../assets/plus-thick.svg");
  vertical-align: text-bottom;
  float: right;
  display: inline-block;
  position: relative;
  width: 18px;
  height: 18px;
}

.itenNameMissing:hover::after {
  content: url("../assets/arrow-up-thick.svg");
  vertical-align: text-bottom;
  float: right;
  display: inline-block;
  width: 18px;
  height: 18px;
}

.itemCount {
  float: right;
  width: 40px;
}

.itemActions {
  padding-top: 6px;
  opacity: 0.7;
  width: 45px;
}

.itemActions:hover {
  opacity: 1;
}</style>