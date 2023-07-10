<template>
  <div>
    <header>
      <h2>{{ list_name }}</h2>
    </header>
    <w-button xl bg-color="light-blue-light5" @click="toggleAddEditItems()" class="fill-width">{{ ((editing) ? 'Done Editing Items' : 'Add / Edit Items') }}</w-button>
    <main>
      <ol v-if="!editing">
        <ListItem v-for="(item, index) in items" :item="item" :index="index" :key="index" />
      </ol>
      <ol v-if="editing">
        <ListItemAll v-for="(item, index) in items" :item="item" :index="index" :key="index" />
      </ol>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import ListItem from '@/components/ListItem.vue';
import ListItemAll from '@/components/ListItemAll.vue';
export default {
  components: {
    ListItem,
    ListItemAll
  },
  data: () => ({
    editing: false,
    list_name: '',
    list_id: 0,
    lists: [],
    items: []
  }),
  methods: {
    getListItems() {
      if (this.list_id > 0) {
        let params = {
          allItems: (this.$route.query.a != undefined)
        };
        axios.get(process.env.VUE_APP_API_URL + '/api/list_items/' + this.list_id, { withCredentials: true, params: params })
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
      }
    },
    getList() {
      axios.get(process.env.VUE_APP_API_URL + '/api/lists/', { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            this.lists = response.data;
            if (this.list_id === 0) {
              this.list_id = this.lists[0].list_id;
              this.$router.push({ name: "AddEditList", params: { list_id: this.list_id } });
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
    toggleAddEditItems() {
      var query = {
        a: 'edit'
      };
      this.editing = !this.editing;
      this.$router.push({ name: "AddEditList", params: { list_id: this.list_id }, query: (this.editing) ? query : {} });
      this.items = new Array();
      setTimeout(() => { this.getListItems() }, 10);
    }
  },
  mounted() {
    this.editing = (this.$route.params.a === 'edit');
    this.getList();
  }
}
</script>
<style scoped>
header {
  border-bottom: 1px solid darkgray;
  text-align: center;
}
</style>