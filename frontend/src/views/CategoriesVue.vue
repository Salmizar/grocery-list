<template>
  <div>
    <header>
      <h2>Categories</h2>
      <ContextMenu :showListOptions="false" />
    </header>
    <w-button xl bg-color="info" v-on:click="toggleAddNewItem" class="fill-width">{{ 'Add a Category'
    }}</w-button>
    <w-transition-expand y>
      <div v-if="addItem">
        <AddEditMisc :item="{}" type="new" :index="0" v-on:updateItem="addNewItem" v-on:cancelItem="cancelItem"
          v-on:deleteItem="toggleAddNewItem" />
      </div>
    </w-transition-expand>
    <main>
      <ol>
        <MiscItem v-on:updateItemOrder="updateItemOrder" v-on:updateItem="updateItem" v-on:cancelItem="cancelItem"
          v-on:deleteItem="deleteItem" v-for="(item, index) in items" type="category" :item="item" :name="item.name"
          :index="index" :key="item.category_id" :lastItem="index === items.length - 1" />
      </ol>
      <LoadingFooter :loading="loading" :itemsLength="items.length" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import ContextMenu from "@/views/ContextMenu.vue";
import MiscItem from '@/components/MiscItem.vue';
import LoadingFooter from "@/components/LoadingFooter.vue";
import AddEditMisc from '@/views/AddEditMisc.vue';
const router = useRouter();
const loading = ref(true);
const addItem = ref(false);
const items = ref([]);
const updateItemOrder = (direction, index, item) => {
  //move original item
  var newOrder_id = item.order_id + direction;
  var oldOrder_id = item.order_id;
  axios.patch(process.env.VUE_APP_API_URL + '/api/categories/' + item.category_id, { order_id: newOrder_id }, { withCredentials: true })
    .then((response) => {
      if (response.status === 200) {
        axios.patch(process.env.VUE_APP_API_URL + '/api/categories/' + items.value[index + direction].category_id,
          { order_id: oldOrder_id }, { withCredentials: true })
          .then((response) => {
            if (response.status === 200) {
              loading.value = false;
              items.value = response.data;
            }
          })
          .catch(error => {
            if (error.response.status === 401) {
              router.push({ name: 'Login' });
            }
          });
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        router.push({ name: 'Login' });
      }
    });
};
const toggleAddNewItem = () => {
  addItem.value = !addItem.value;
};
const addNewItem = (name) => {
  axios.post(process.env.VUE_APP_API_URL + '/api/categories/',
    { name: name, order_id: items.value.length + 1 },
    { withCredentials: true }
  )
    .then((response) => {
      if (response.status === 200) {
        loading.value = false;
        addItem.value = false;
        items.value.push(response.data);
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        router.push({ name: 'Login' });
      }
    });
};
const updateItem = (name, item) => {
  axios.patch(process.env.VUE_APP_API_URL + '/api/categories/' + item.category_id, { name: name }, { withCredentials: true })
    .then((response) => {
      if (response.status === 200) {
        loading.value = false;
        item.name = name;
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        router.push({ name: 'Login' });
      }
    });
};
const cancelItem = () => {
  addItem.value = false;
};
const deleteItem = (item) => {
  axios.delete(process.env.VUE_APP_API_URL + '/api/categories/' + item.category_id, { withCredentials: true })
    .then((response) => {
      if (response.status === 200) {
        loading.value = false;
        items.value = items.value.filter((itemtoCheck) => itemtoCheck.category_id != item.category_id);
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        router.push({ name: 'Login' });
      }
    });
};
const getItems = () => {
  loading.value = true;
  axios.get(process.env.VUE_APP_API_URL + '/api/categories/', { withCredentials: true })
    .then((response) => {
      if (response.status === 200) {
        loading.value = false;
        items.value = response.data;
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        router.push({ name: 'Login' });
      }
    });
};
onMounted(() => {
  getItems();
});
</script>
<style scoped>
/* header/h2 tags in app.vue*/
</style>