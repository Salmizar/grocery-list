<template>
  <div>
    <header>
      <h2>List Vue</h2>
    </header>
    <w-button lg bg-color="light-blue-light5" class="fill-width">Add/Edit Items</w-button>
    <main>
      <ol>
        <ListItem v-for="(item, index) in items" :items="items" :item="item" :index="index" :key="index" />
      </ol>
    </main>
  </div>
</template>

<script>
import axios from "axios";

import ListItem from '@/components/ListItem.vue';

export default {
  components: {
    ListItem
  },
  data: () => ({
    lists: [],
    items: []
  }),
  methods: {
    getListItems(id) {
      axios.get(process.env.VUE_APP_API_URL + '/api/list_items/' + id, { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            this.items = response.data;
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            alert('An Error ocurred obtaining a lists items');
          }
        });
    },
    getList() {
      axios.get(process.env.VUE_APP_API_URL + '/api/lists/', { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            this.lists = response.data;
            if (this.lists.length > 0) {
              this.getListItems(this.lists[0].list_id);
            }
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
    this.getList();
  }
}
</script>
<style>
header {
  border-bottom: 1px solid darkgray;
  text-align: center;
}
</style>