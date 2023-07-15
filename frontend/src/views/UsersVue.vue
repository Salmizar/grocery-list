<template>
  <div>
    <header>
      <h2>Users</h2>
      <ContextMenu :showListOptions="false" />
    </header>
    <w-button v-if="isAdmin" xl bg-color="light-blue-light5" v-on:click="toggleAddNewItem" class="fill-width">{{ 'Add a User' }}</w-button>
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
    isAdmin: false,
    items: []
  }),
  methods: {
    toggleAddNewItem() {
      this.addItem = !this.addItem;
    },
    addNewItem(item, name, email) {
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
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.$router.push({ name: 'Login' });
          }
        });
    },
    updateItem(item, name, email, password) {
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
            this.loading = false;
            for (let itm in this.items) {
              if (this.items[itm].user_id === response.data.user_id) {
                this.items[itm] = response.data;
              }
            }
            item = response.data;
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
      axios.delete(process.env.VUE_APP_API_URL + '/api/users/' + item.user_id, { withCredentials: true })
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
        });
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
    this.isAdmin = Boolean(window.$cookies.get('isAdmin')==='true');
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