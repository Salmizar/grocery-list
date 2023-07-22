<template>
  <li v-if="firstInCategory">
    <w-flex justify-space-between class="pt2 pb2 pl3 white category">
      <div>{{ categoryName }}</div>
    </w-flex>
  </li>
  <w-transition-expand y>
    <li v-if="showItem()" v-on:click="setItemCount(-1)">
      <w-flex class="item" justify-space-between v-bind:class="{ 'itemDone grey-light3': item.count === 0 }">
        <div class="pt2 pb2 pl3 xs10 itemName">
          {{ itemName }}
          <span v-if="item.count === 0"> - Done</span>
        </div>
        <w-transition-slide left>
          <div v-if="(item.count > 0)" class="xs1 text-center pt2">{{ item.count }}
          </div>
        </w-transition-slide>
        <div class="xs1">&nbsp;</div>
      </w-flex>
    </li>
  </w-transition-expand>
</template>
<script setup>
import { defineEmits, defineProps, ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import axios from "axios";
const router = useRouter();
const firstInCategory = ref(false);
const categoryName = ref('');
const itemName = ref('');
const newCount = ref(0);
let updateCountTimeout = 0;
const emits = defineEmits([
  'updateItem'
]);
const props = defineProps({
  item: Object,
  items: Object,
  index: Number,
  showDone: Boolean,
  storeFilter: Number
});
const showItem = () => {
  if (props.storeFilter > 0 && props.item.item) {
    if (props.item.item.store_ids) {
      return props.item.item.store_ids.indexOf(props.storeFilter) > -1 && (props.item.count > 0 || props.showDone)
    } else {
      return false;
    }
  } else {
    return props.item.count > 0 || props.showDone;
  }
};
const updateItemCount = () => {
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
        alert('An Error ocurred updating the item count');
        router.push({ name: "Login" });
      }
    });
};
const setItemCount = (lowerCount) => {
  if (props.item.count > 0) {
    newCount.value = ((lowerCount === 0) ? 0 : (props.item.count + lowerCount));
    emits('updateItem', props.index, { count: newCount.value });
    updateObjs();
    clearTimeout(updateCountTimeout);
    updateCountTimeout = setTimeout(() => { updateItemCount() }, 2000);
  }
};
const updateObjs = () => {
  if (props.item && props.item.item) {
    categoryName.value = ((props.item.item.category) ? props.item.item.category.name : 'Uncategorized');
    itemName.value = props.item.item.name;
    firstInCategory.value = props.index === 0 || props.items[props.index - 1].item.category_id != props.item.item.category_id;
  }
};
onMounted(() => {
  updateObjs();
});
</script>
<style scoped>
li {
  border-bottom: 1px solid darkgray;
}
.category {
  background-color: #93c47d;
  font-weight: bold;
  text-shadow: 0 0 1px #000;
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
  background-color: rgba(200, 200, 200, 0.2);
}
.itemDone {
  cursor: default;
}
.itemName {
  overflow: hidden;
  white-space: nowrap;
}
</style>