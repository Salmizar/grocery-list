<template>
  <div>
    <header>
      <h2>Items</h2>
      <ContextMenu :showListOptions="false" />
    </header>
    <w-button xl bg-color="info" v-on:click="toggleAddNewItem" class="fill-width">{{ 'Add a Item' }}</w-button>
    <w-transition-expand y>
      <div v-if="addItem" class="add-item">
        <AddEditMisc :item="{}" type="items-new" :index="0" v-on:updateItem="addNewItem" v-on:cancelItem="cancelItem"
          v-on:deleteItem="toggleAddNewItem" />
      </div>
    </w-transition-expand>
    <main>
      <ol>
        <MiscItem v-on:updateItem="updateItem" v-on:cancelItem="cancelItem" v-on:deleteItem="deleteItem"
          v-for="(item, index) in items" type="items" :item="item" :name="item.name" :index="index" :key="item.item_id" />
      </ol>
      <LoadingFooter :loading="loading" :itemsLength="items.length" />
    </main>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
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
const toggleAddNewItem = () => {
  addItem.value = !addItem.value;
};
const addNewItem = (name, item, category, stores) => {
  axios.post(process.env.VUE_APP_API_URL + '/api/items/',
    { name: name, category_id: category, store_ids: stores.join(",") },
    { withCredentials: true }
  )
    .then((response) => {
      if (response.status === 200) {
        loading.value = false;
        addItem.value = false;
        items.value.push(response.data);
        var result = JSON.parse(JSON.stringify(items.value)).sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) { return -1; }
          if (nameA > nameB) { return 1; }
          return 0;
        });
        items.value = result;
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        router.push({ name: 'Login' });
      }
    });
};
const updateItem = (name, item, category, stores) => {
  axios.patch(process.env.VUE_APP_API_URL + '/api/items/' + item.item_id,
    { name: name, category_id: category, store_ids: stores.join(",") },
    { withCredentials: true })
    .then((response) => {
      if (response.status === 200) {
        loading.value = false;
        for (let itm in items.value) {
          if (items.value[itm].item_id === response.data[0].item_id) {
            items.value[itm] = response.data[0];
          }
        }
        item = response.data[0];
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
  axios.delete(process.env.VUE_APP_API_URL + '/api/items/' + item.item_id, { withCredentials: true })
    .then((response) => {
      if (response.status === 200) {
        loading.value = false;
        items.value = items.value.filter((itemtoCheck) => itemtoCheck.item_id != item.item_id);
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        router.push({ name: 'Login' });
      }
    });
};
const getItems = () => {
  axios.get(process.env.VUE_APP_API_URL + '/api/items/', { withCredentials: true })
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
const getCategories = () => {
  loading.value = true;
  axios.get(process.env.VUE_APP_API_URL + '/api/categories/', { withCredentials: true })
    .then((response) => {
      if (response.status === 200) {
        window.localStorage.setItem("mygrocerylist-categories", JSON.stringify(response.data));
        getItems();
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        router.push({ name: 'Login' });
      }
    });
};
onMounted(() => {
  getCategories();
});
</script>
<style scoped>
/* header/h2 tags in app.vue*/
.add-item {
  border-bottom: 1px solid rgb(200, 200, 200);
}
</style>