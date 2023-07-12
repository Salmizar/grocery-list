<template>
  <div>
    <header>
      <ContextMenu :showListOptions="true" :showDone="showDone" :storeFilter="storeFilter" />
      <h2>{{ list_name }}</h2>
    </header>
    <w-button xl bg-color="light-blue-light5" @click="toggleAddEditItems()" class="fill-width">{{ ((editing) ? `Done
      Editing` : 'Edit Items') }}</w-button>
    <main>
      <ol v-if="!editing">
        <ListItem v-for="(item, index) in items" :item="item" :index="index" :key="index" :showDone="showDone"
          :storeFilter="storeFilter" />
      </ol>
      <ol v-if="editing">
        <ListItemAll v-for="(item, index) in items" :item="item" :index="index" :key="index" />
      </ol>
      <LoadingFooter :loading="loading" :itemsLength="items.length" />
    </main>
  </div>
</template>

<script>
import ContextMenu from "@/views/ContextMenu.vue";
import axios from "axios";
import ListItem from '@/views/ListItem.vue';
import ListItemAll from '@/views/ListItemAll.vue';
import LoadingFooter from "@/components/LoadingFooter.vue";
export default {
  components: {
    ListItem,
    ListItemAll,
    ContextMenu,
    LoadingFooter
  },
  data: () => ({
    showDone: true,
    storeFilter: 0,
    loading: true,
    editing: false,
    list_name: '',
    list_id: 0,
    lists: [],
    items: []
  }),
  methods: {
    updateShowDone(filterDone) {
      this.showDone = filterDone;
    },
    updateStoreFilter(newStoreFilter) {
      this.storeFilter = newStoreFilter;
    },
    updateItem(index, columns) {
      for (let column in columns) {
        this.items[index][column] = columns[column];
      }
    },
    getListItems() {
      if (this.list_id > 0) {
        this.loading = true;
        this.items = new Array();
        axios.get(process.env.VUE_APP_API_URL + '/api/list_items/' + this.list_id, { withCredentials: true, params: { allItems: this.editing } })
          .then((response) => {
            if (response.status === 200) {
              this.items = response.data;
              this.loading = false;
            }
          })
          .catch(error => {
            if (error.response.status === 401) {
              alert('An Error ocurred obtaining a lists items');
            }
          });
      }
    },
    getLists() {
      this.lists = new Array();
      axios.get(process.env.VUE_APP_API_URL + '/api/lists/', { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            this.lists = response.data;
            window.localStorage.setItem("mygrocerylist-lists", JSON.stringify(this.lists));
            if (this.list_id === 0) {
              this.list_id = this.lists[0].list_id;
              this.$router.push({ name: "AddEditList", params: { list_id: this.list_id }, query: this.$route.query });
            }
            this.list_id = this.lists.filter((obj) => obj.list_id === this.list_id)[0].list_id;
            this.list_name = this.lists.filter((obj) => obj.list_id === this.list_id)[0].name;
            this.getListItems();
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.$router.push({ name: 'Login' });
          }
        });
    },
    getStores() {
      axios.get(process.env.VUE_APP_API_URL + '/api/Stores/', { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            window.localStorage.setItem("mygrocerylist-stores", JSON.stringify(response.data));
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.$router.push({ name: 'Login' });
          }
        });
    },
    toggleAddEditItems() {
      this.editing = !this.editing;
      this.$router.push({ name: "AddEditList", params: { list_id: this.list_id }, query: (this.editing) ? { a: 'edit' } : {} });
      setTimeout(() => { this.getListItems() }, 10);
    }
  },
  mounted() {
    this.editing = (this.$route.query.a === 'edit');
    this.list_id = ((this.$route.params.list_id != undefined) ? Number(this.$route.params.list_id) : 0);
    this.showDone = JSON.parse(window.localStorage.getItem("mygrocerylist-filter-done"));
    this.storeFilter = window.localStorage.getItem("mygrocerylist-filter-storeFilter");
    this.storeFilter = isNaN(this.storeFilter) ? 0 : Number(this.storeFilter);
    this.getStores();
    this.getLists();
  }
}
</script>
<style scoped>
header {
  border-bottom: 1px solid darkgray;
  text-align: center;
}

.info {
  padding-top: 40px;
  text-align: center;
}
</style>