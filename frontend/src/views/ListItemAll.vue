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
<script setup>
import { defineEmits, defineProps, ref, onMounted } from 'vue';
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
const router = useRouter();
const route = useRoute();
const firstInCategory = ref(false);
const notCreatingaListItem = ref(true);
const hasItems = ref(false);
const newCount = ref(0);
let updateCountTimeout = 0;
const emits = defineEmits([
  'updateItem'
]);
const props = defineProps({
  item: Object,
  items: Object,
  index: Number
});
const updateItemCount = () => {
  if (newCount.value === 0) {
    axios.delete(process.env.VUE_APP_API_URL + '/api/list_items/' + props.item.list_item_id,
      { withCredentials: true }
    )
      .then((response) => {
        if (response.status === 200) {
          emits('updateItem', props.index, { count: null, list_item_id: null });
        }
      })
      .catch(error => {
        if (error.response.status === 401) {
          alert('An Error ocurred deleting an item');
          router.push({ name: "Login" });
        }
      });
  } else {
    axios.patch(process.env.VUE_APP_API_URL + '/api/list_items/' + props.item.list_item_id,
      { count: newCount.value },
      { withCredentials: true }
    )
      .then((response) => {
        if (response.status === 200) {
          emits('updateItem', props.index, { count: response.data[1].count });
        }
      })
      .catch(error => {
        if (error.response.status === 401) {
          alert('An Error ocurred updating the items count');
          router.push({ name: "Login" });
        }
      });
  }
};
const setItemCount = (incriment) => {
  if (hasItems.value || props.item.count === 0) {
    //Adjust counter in realtime and create timeout to actually update item when user finishes making their adjustment
    if (props.item.count + incriment >= 0) {
      newCount.value = props.item.count + incriment;
    }
    emits('updateItem', props.index, { count: newCount.value });
    updateObjs();
    clearTimeout(updateCountTimeout);
    updateCountTimeout = setTimeout(() => { updateItemCount() }, 500);
  } else if (notCreatingaListItem.value && incriment===1) {
    notCreatingaListItem.value = false;
    axios.post(process.env.VUE_APP_API_URL + '/api/list_items/',
      { list_id: route.params.list_id, item_id: props.item.item_id, count: 1 },
      { withCredentials: true }
    )
      .then((response) => {
        if (response.status === 200) {
          notCreatingaListItem.value = true;
          emits('updateItem', props.index, response.data);
          updateObjs();
        }
      })
      .catch(error => {
        if (error.response.status === 401) {
          alert('An Error ocurred inserting a new item');
          router.push({ name: "Login" });
        }
      });
      if (notCreatingaListItem.value) {
          router.push({ name: "Login" });
      }
  }
};
const updateObjs = () => {
  hasItems.value = (props.item.count != null && props.item.count > 0);
  firstInCategory.value = props.index === 0 || props.items[props.index - 1].category_id != props.item.category_id;
};
onMounted(() => {
  updateObjs();
});
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