<template>
  <div>
    <header>
      <h2 v-on:click="editList" title="Edit Name" class="pointer">{{ list_name }}</h2>
      <ContextMenu ref="contextMenu" :showListOptions="true" :showDone="showDone" :storeFilter="storeFilter"
        v-on:updateShowDone="updateShowDone" v-on:updateStoreFilter="updateStoreFilter" v-on:updateLists="getLists" />
    </header>
    <w-button xl bg-color="info" v-on:click="toggleAddEditItems()" class="fill-width">{{ ((editing) ? `Done
      Editing` : 'Edit Items') }}</w-button>
    <main>
      <ol v-if="!editing">
        <ListItem v-for="(item, index) in items" :item="item" :items="items" :index="index" :key="index" :showDone="showDone"
          :storeFilter="storeFilter" v-on:updateItem="updateItem" />
      </ol>
      <ol v-if="editing">
        <ListItemAll v-for="(item, index) in items" :item="item" :items="items" :index="index" :key="index"
          v-on:updateItem="updateItem" />
      </ol>
      <LoadingFooter :loading="loading" :itemsLength="items.length" />
    </main>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import ContextMenu from "@/views/ContextMenu.vue";
import ListItem from '@/views/ListItem.vue';
import ListItemAll from '@/views/ListItemAll.vue';
import LoadingFooter from "@/components/LoadingFooter.vue";
const router = useRouter();
const route = useRoute();
const contextMenu = ref();
const showDone = ref(true);
const storeFilter = ref(0);
const loading = ref(true);
const editing = ref(false);
const list_name = ref('');
const list_id = ref(0);
const lists = ref([]);
const items = ref([]);
const editList = () => {
  contextMenu.value.editList(list_id.value, list_name.value);
}
const updateShowDone = (filterDone) => {
  showDone.value = filterDone;
};
const updateStoreFilter = (newStoreFilter) => {
  storeFilter.value = newStoreFilter;
};
const updateItem = (index, columns) => {
  for (let column in columns) {
    items.value[index][column] = columns[column];
  }
};
const getListItems = () => {
  if (list_id.value > 0) {
    loading.value = true;
    items.value = new Array();
    axios.get(process.env.VUE_APP_API_URL + '/api/list_items/' + list_id.value, { withCredentials: true, params: { allItems: editing.value } })
      .then((response) => {
        if (response.status === 200) {
          items.value = response.data;
          loading.value = false;
        }
      })
      .catch(error => {
        if (error.response.status === 401) {
          alert('An Error ocurred obtaining an item list');
          router.push({ name: "Login" });
        }
      });
  }
};
const getLists = (new_list_id) => {
  lists.value = new Array();
  axios.get(process.env.VUE_APP_API_URL + '/api/lists/', { withCredentials: true })
    .then((response) => {
      if (response.status === 200) {
        lists.value = new Array();
        lists.value = response.data;
        window.localStorage.setItem("mygrocerylist-lists", JSON.stringify(lists.value));
        if (new_list_id) {
          list_id.value = new_list_id;
        }
        let found_list_id = lists.value.filter((obj) => obj.list_id === list_id.value);
        if (found_list_id.length === 0) {
          list_id.value = lists.value[0].list_id;
        }
        if (list_id.value != route.params.list_id) {
          router.push({ name: "AddEditList", params: { list_id: list_id.value }, query: route.query });
        }
        list_id.value = lists.value.filter((obj) => obj.list_id === list_id.value)[0].list_id;
        list_name.value = lists.value.filter((obj) => obj.list_id === list_id.value)[0].name;
        contextMenu.value.updateLists();
        getListItems();
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        router.push({ name: 'Login' });
      }
    });
};
const getStores = () => {
  axios.get(process.env.VUE_APP_API_URL + '/api/Stores/', { withCredentials: true })
    .then((response) => {
      if (response.status === 200) {
        window.localStorage.setItem("mygrocerylist-stores", JSON.stringify(response.data));
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        router.push({ name: 'Login' });
      }
    });
};
const toggleAddEditItems = () => {
  editing.value = !editing.value;
  router.push({ name: "AddEditList", params: { list_id: list_id.value }, query: (editing.value) ? { a: 'edit' } : {} });
  setTimeout(() => { getListItems() }, 10);
};
onMounted(() => {
  editing.value = (route.query.a === 'edit');
  list_id.value = ((route.params.list_id != undefined) ? Number(route.params.list_id) : 0);
  showDone.value = JSON.parse(window.localStorage.getItem("mygrocerylist-filter-done"));
  storeFilter.value = window.localStorage.getItem("mygrocerylist-filter-storeFilter");
  storeFilter.value = isNaN(storeFilter.value) ? 0 : Number(storeFilter.value);
  getStores();
  getLists();
});
</script>
<style scoped>
/* header/h2 tags in app.vue*/
.pointer {
  cursor: pointer;
}
.info {
  padding-top: 40px;
  text-align: center;
}
</style>