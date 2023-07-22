<template>
  <div>
    <header>
      <h2>Users</h2>
      <ContextMenu :showListOptions="false" />
    </header>
    <w-button v-if="isAdmin" xl bg-color="info" v-on:click="toggleAddNewItem" class="fill-width">{{ 'Add a User'
    }}</w-button>
    <w-transition-expand y>
      <div v-if="addItem" class="add-item">
        <AddEditUser :item="{}" type="new" :index="0" v-on:updateItem="addNewItem" v-on:cancelItem="cancelItem"
          v-on:deleteItem="toggleAddNewItem" />
      </div>
    </w-transition-expand>
    <main>
      <ol>
        <MiscItem v-on:updateItem="updateItem" v-on:cancelItem="cancelItem" v-on:deleteItem="deleteItem"
          v-for="(item, index) in items" type="user" :item="item" :name="item.name" :index="index" :key="item.user_id" />
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
import AddEditUser from '@/views/AddEditUser.vue';
import LoadingFooter from "@/components/LoadingFooter.vue";
const router = useRouter();
const loading = ref(true);
const addItem = ref(false);
const isAdmin = ref(false);
const items = ref([]);
const toggleAddNewItem = () => {
  addItem.value = !addItem.value;
};
const addNewItem = (item, name, email) => {
  axios.post(process.env.VUE_APP_API_URL + '/api/users/',
    { name: name, email: email },
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
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        router.push({ name: 'Login' });
      }
    });
};
const updateItem = (item, name, email, password) => {
  let parms = {
    name: name,
    email: email
  }
  if (password) {
    parms.password = password;
  }
  axios.patch(process.env.VUE_APP_API_URL + '/api/users/' + item.user_id, parms, { withCredentials: true })
    .then((response) => {
      if (response.status === 200) {
        item = response.data;
        loading.value = false;
        for (let itm in items.value) {
          if (items.value[itm].user_id === response.data.user_id) {
            items.value[itm] = response.data;
          }
        }
        item = response.data;
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
  axios.delete(process.env.VUE_APP_API_URL + '/api/users/' + item.user_id, { withCredentials: true })
    .then((response) => {
      if (response.status === 200) {
        items.value = items.value.filter((itemtoCheck) => itemtoCheck.user_id != item.user_id);
        loading.value = false;
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
  axios.get(process.env.VUE_APP_API_URL + '/api/users/', { withCredentials: true })
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
onMounted(() => {
  isAdmin.value = Boolean(window.$cookies.get('isAdmin') === 'true');
  getItems();
});
</script>
<style scoped>
/* header/h2 tags in app.vue*/
.add-item {
  border-bottom: 1px solid darkgray;
}
</style>