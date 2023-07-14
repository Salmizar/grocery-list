<template>
  <div>
    <header>
      <ContextMenu :showListOptions="false" />
      <h2>Users</h2>
    </header>
    <w-button xl bg-color="light-blue-light5" @click="toggleAddNewItem" class="fill-width">{{ 'Add a User' }}</w-button>
    <w-transition-expand y>
      <div v-if="addItem" class="add-item">
        <AddEditUser :item="{}" type="new" :index="0" v-on:updateItem="addNewItem" v-on:cancelItem="cancelItem"
          v-on:deleteItem="toggleAddNewItem" />
      </div>
    </w-transition-expand>
    <main>
      <ol>
        <MiscItem v-on:updateItem="updateItem" v-on:cancelItem="cancelItem" v-on:deleteItem="deleteItem"
          v-for="(item, index) in items" type="user" :item="item" :name="item.name" :index="index"
          :key="item.user_id" />
      </ol>
      <LoadingFooter :loading="loading" :itemsLength="items.length" />
    </main>
  </div>
</template>

<script>
import axios from "axios";
import ContextMenu from "@/views/ContextMenu.vue";
import MiscItem from '@/components/MiscItem.vue';
import AddEditUser from '@/views/AddEditUser.vue';
import LoadingFooter from "@/components/LoadingFooter.vue";
export default {
  components: {
    MiscItem,
    ContextMenu,
    LoadingFooter,
    AddEditUser

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
    addNewItem(name, email) {
      axios.post(process.env.VUE_APP_API_URL + '/api/users/',
        { name: name, email: email },
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
      window.localStorage.setItem("mygrocerylist-users", JSON.stringify(this.items));
    },
    updateItem(name, item) {
      axios.patch(process.env.VUE_APP_API_URL + '/api/users/' + item.user_id, { name: name }, { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            item.name = name;
            this.loading = false;
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
      console.log('deleteItem',item);
      /*axios.delete(process.env.VUE_APP_API_URL + '/api/users/' + item.user_id, { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            this.items = this.items.filter((itemtoCheck) => itemtoCheck.user_id != item.user_id);
            this.loading = false;
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.$router.push({ name: 'Login' });
          }
        });*/
    },
    getItems() {
      this.loading = true;
      axios.get(process.env.VUE_APP_API_URL + '/api/users/', { withCredentials: true })
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

.add-item {
  border-bottom: 1px solid darkgray;

}</style>