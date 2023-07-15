<template>
  <div>
    <header>
      <h2>Items</h2>
      <ContextMenu :showListOptions="false" />
    </header>
    <w-button xl bg-color="light-blue-light5" v-on:click="toggleAddNewItem" class="fill-width">{{ 'Add a Item' }}</w-button>
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
  
<script>
import axios from "axios";
import ContextMenu from "@/views/ContextMenu.vue";
import MiscItem from '@/components/MiscItem.vue';
import LoadingFooter from "@/components/LoadingFooter.vue";
import AddEditMisc from '@/views/AddEditMisc.vue';
export default {
  components: {
    MiscItem,
    ContextMenu,
    LoadingFooter,
    AddEditMisc

  },
  data: () => ({
    loading: true,
    addItem: false,
    items: []
  }),
  methods: {
    toggleAddNewItem() {
      this.addItem = !this.addItem;
    },
    addNewItem(name, item, category, stores) {
      axios.post(process.env.VUE_APP_API_URL + '/api/items/',
        { name: name, category_id: category, store_ids: stores.join(",") },
        { withCredentials: true }
      )
        .then((response) => {
          if (response.status === 200) {
            this.loading = false;
            this.addItem = false;
            this.items.push(response.data);
            var result = JSON.parse(JSON.stringify(this.items)).sort((a, b) => {
              const nameA = a.name.toUpperCase();
              const nameB = b.name.toUpperCase();
              if (nameA < nameB) { return -1; }
              if (nameA > nameB) { return 1; }
              return 0;
            });
            this.items = result;
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.$router.push({ name: 'Login' });
          }
        });
    },
    updateItem(name, item, category, stores) {
      axios.patch(process.env.VUE_APP_API_URL + '/api/items/' + item.item_id,
        { name: name, category_id: category, store_ids: stores.join(",") },
        { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            this.loading = false;
            for (let itm in this.items) {
              if (this.items[itm].item_id === response.data[0].item_id) {
                this.items[itm] = response.data[0];
              }
            }
            item = response.data[0];
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.$router.push({ name: 'Login' });
          }
        });
    },
    cancelItem() {
      this.addItem = false;
    },
    deleteItem(item) {
      axios.delete(process.env.VUE_APP_API_URL + '/api/items/' + item.item_id, { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            this.loading = false;
            this.items = this.items.filter((itemtoCheck) => itemtoCheck.item_id != item.item_id);
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.$router.push({ name: 'Login' });
          }
        });
    },
    getItems() {
      axios.get(process.env.VUE_APP_API_URL + '/api/items/', { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            this.loading = false;
            this.items = response.data;
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.$router.push({ name: 'Login' });
          }
        });
    },
    getCategories() {
      this.loading = true;
      axios.get(process.env.VUE_APP_API_URL + '/api/categories/', { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            window.localStorage.setItem("mygrocerylist-categories", JSON.stringify(response.data));
            this.getItems();
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.$router.push({ name: 'Login' });
          }
        });
    }
  },
  mounted() {
    this.getCategories();
  }
}
</script>
<style scoped>
header {
  border-bottom: 1px solid darkgray;
  text-align: center;
  height: 27px;
}
h2 {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
}

.add-item {
  border-bottom: 1px solid rgb(200, 200, 200);
}
</style>