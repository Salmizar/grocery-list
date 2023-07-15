<template>
  <li v-if="firstInCategory" class="category">
    <w-flex justify-space-between class="pt2 pb2 pl3 white categories">
      <div class="xs10 shrink">{{ item.category_name }}</div>
      <div class="xs1  text-center">In&nbsp;List</div>
      <div class="xs1">&nbsp;</div>
    </w-flex>
  </li>
  <li>
    <w-flex class="item" justify-space-between>
      <div v-on:click="setItemCount(1)" v-bind:class="{ 'grey-light3': hasItems }" class="xs9 pt2 pb2 pl3 itemName"
        title="Add an Item">
        {{ item.item_name }}
      </div>
      <div v-on:click="setItemCount(1)" class="xs1 itemActions text-right" title="Add an Item">
        <w-icon lg>mdi mdi-chevron-up</w-icon>
      </div>
      <div title="Add an Item" v-on:click="setItemCount(1)" v-bind:class="{ 'grey-light3': hasItems }"
        class="xs1 pt2 pb2 text-center">{{ item.count }}</div>
      <div v-on:click="setItemCount(-1)" class="xs1 itemActions" title="Remove an Item">
        <w-transition-slide left>
          <w-icon lg v-if="hasItems">mdi mdi-chevron-down</w-icon>
        </w-transition-slide>
      </div>
    </w-flex>
  </li>
</template>
<script>
import axios from "axios";
export default {
  emits: ['updateItem'],
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
              this.$emit('updateItem', this.index, { count: null, list_item_id: null });
            }
          })
          .catch(error => {
            if (error.response.status === 401) {
              alert('An Error ocurred deleting an item');
              this.$router.push({ name: "Login" });
            }
          });
      } else {
        axios.patch(process.env.VUE_APP_API_URL + '/api/list_items/' + this.item.list_item_id,
          { count: this.newCount },
          { withCredentials: true }
        )
          .then((response) => {
            if (response.status === 200) {
              this.$emit('updateItem', this.index, { count: response.data[1].count });
            }
          })
          .catch(error => {
            if (error.response.status === 401) {
              alert('An Error ocurred updating the items count');
              this.$router.push({ name: "Login" });
            }
          });
      }
    },
    setItemCount(incriment) {
      if (this.hasItems || this.item.count === 0) {
        this.newCount = this.item.count + incriment;
        this.$emit('updateItem', this.index, { count: this.newCount });
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
              this.$emit('updateItem', this.index, response.data);
              this.updateObjs();
            }
          })
          .catch(error => {
            if (error.response.status === 401) {
              alert('An Error ocurred inserting a new item');
              this.$router.push({ name: "Login" });
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
  white-space: nowrap;
}

.categories {
  overflow: hidden;
  white-space: nowrap;
  display: block;
  font-weight: bold;
  text-shadow: 0 0 1px #000;
}

.category {
  background-color: #93c47d;
}

li {
  border-bottom: 1px solid darkgray;
}

.item {
  cursor: pointer;
  animation: fadeIn 0.3s linear;
  white-space: nowrap;
}

.item:hover {
  background-color: rgba(200, 200, 200, 0.2);
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

.itemActions {
  padding-top: 6px;
  opacity: 0.7;
}

.w45 {
  width: 45px;
}

.itemActions:hover {
  opacity: 1;
}
</style>