<template>
  <div>
    <header>
      <h2>Stores</h2>
      <ContextMenu :showListOptions="false" />
    </header>
    <w-button xl bg-color="info" v-on:click="toggleAddNewItem" class="fill-width">{{ 'Add a Store' }}</w-button>
    <w-transition-expand y>
      <div v-if="addItem" class="add-item">
        <AddEditMisc :item="{}" type="new" :index="0" v-on:updateItem="addNewItem" v-on:cancelItem="cancelItem"
          v-on:deleteItem="toggleAddNewItem" />
      </div>
    </w-transition-expand>
    <main>
      <ol>
        <MiscItem v-on:updateItem="updateItem" v-on:cancelItem="cancelItem" v-on:deleteItem="deleteItem"
          v-for="(item, index) in items" type="store" :item="item" :name="item.name" :index="index"
          :key="item.store_id" />
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
const toggleAddNewItem = () => {
  addItem.value = !addItem.value;
};
const addNewItem = (name) => {
  axios.post(process.env.VUE_APP_API_URL + '/api/stores/',
    { name: name },
    { withCredentials: true }
  )
    .then((response) => {
      if (response.status === 200) {
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
        updateStorage();
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        router.push({ name: 'Login' });
      }
    });
};
const updateStorage = () => {
  loading.value = false;
  window.localStorage.setItem("mygrocerylist-stores", JSON.stringify(items.value));
};
const updateItem = (name, item) => {
  axios.patch(process.env.VUE_APP_API_URL + '/api/stores/' + item.store_id, { name: name }, { withCredentials: true })
    .then((response) => {
      if (response.status === 200) {
        item.name = name;
        updateStorage();
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
  axios.delete(process.env.VUE_APP_API_URL + '/api/stores/' + item.store_id, { withCredentials: true })
    .then((response) => {
      if (response.status === 200) {
        items.value = items.value.filter((itemtoCheck) => itemtoCheck.store_id != item.store_id);
        updateStorage();
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
  axios.get(process.env.VUE_APP_API_URL + '/api/stores/', { withCredentials: true })
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
.add-item {
  border-bottom: 1px solid darkgray;
}
</style>