<template>
  <div>
    <header>
      <h2>Stores</h2>
      <ContextMenu :showListOptions="false" />
    </header>
    <w-button xl bg-color="light-blue-light5" v-on:click="toggleAddNewItem" class="fill-width">{{ 'Add a Store' }}</w-button>
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
    addNewItem(name) {
      axios.post(process.env.VUE_APP_API_URL + '/api/stores/',
        { name: name },
        { withCredentials: true }
      )
        .then((response) => {
          if (response.status === 200) {
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
            this.updateStorage();
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.$router.push({ name: 'Login' });
          }
        });
    },
    updateStorage() {
      this.loading = false;
      window.localStorage.setItem("mygrocerylist-stores", JSON.stringify(this.items));
    },
    updateItem(name, item) {
      axios.patch(process.env.VUE_APP_API_URL + '/api/stores/' + item.store_id, { name: name }, { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            item.name = name;
            this.updateStorage();
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
      axios.delete(process.env.VUE_APP_API_URL + '/api/stores/' + item.store_id, { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            this.items = this.items.filter((itemtoCheck) => itemtoCheck.store_id != item.store_id);
            this.updateStorage();
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.$router.push({ name: 'Login' });
          }
        });
    },
    getItems() {
      this.loading = true;
      axios.get(process.env.VUE_APP_API_URL + '/api/stores/', { withCredentials: true })
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
    }
  },
  mounted() {
    this.getItems();
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
  border-bottom: 1px solid darkgray;

}</style>