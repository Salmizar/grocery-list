<template>
  <div>
    <header>
      <ContextMenu :showListOptions="false" />
      <h2>Categories</h2>
    </header>
    <w-button xl bg-color="light-blue-light5" @click="toggleAddNewItem" class="fill-width">{{ 'Add a Category' }}</w-button>
    <w-transition-expand y>
            <div v-if="addItem">
                <AddEditMisc :item="{}" type="new" :index="0" v-on:updateItem="addNewItem" v-on:cancelItem="cancelItem" v-on:deleteItem="toggleAddNewItem" />
            </div>
        </w-transition-expand>
    <main>
      <ol>
        <MiscItem v-on:updateItem="updateItem" v-on:cancelItem="cancelItem" v-on:deleteItem="deleteItem" v-for="(item, index) in items" type="category"
          :item="item" :name="item.name" :index="index" :key="index" />
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
      axios.post(process.env.VUE_APP_API_URL + '/api/categories/',
          { name: name, order_id: this.items.length+1 },
          { withCredentials: true }
        )
        .then((response) => {
          if (response.status === 200) {
            this.loading = false;
            this.addItem = false;
            this.items.push(response.data);
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.$router.push({ name: 'Login' });
          }
        });
    },
    updateItem(name, item) {
      axios.patch(process.env.VUE_APP_API_URL + '/api/categories/' + item.category_id, {name: name, order_id: item.order_id }, { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            this.loading = false;
            item.name = name;
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
      axios.delete(process.env.VUE_APP_API_URL + '/api/categories/' + item.category_id, { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            this.loading = false;
            this.items = this.items.filter((itemtoCheck) => itemtoCheck.category_id != item.category_id);
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
      axios.get(process.env.VUE_APP_API_URL + '/api/categories/', { withCredentials: true })
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
}
</style>