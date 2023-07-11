<template>
  <div>
    <header>
      <ContextMenu :showListOptions="false" />
      <h2>Stores</h2>
    </header>
    <w-button xl bg-color="light-blue-light5" @click="addItem()" class="fill-width">{{ 'Add a Store' }}</w-button>
    <main>
      <ol>
        <MiscItem v-for="(item, index) in items" type="stores" :name="item.name" :index="index" :key="index" />
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
export default {
  components: {
    MiscItem,
    ContextMenu,
    LoadingFooter
  },
  data: () => ({
    loading: true,
    items: []
  }),
  methods: {
    addItem() {

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
    },
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