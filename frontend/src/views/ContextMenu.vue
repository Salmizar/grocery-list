<template>
    <w-icon v-on:click="(e) => showMenu(e, 1)" lg class="menu-btn pl2 pt2">mdi mdi-menu</w-icon>
    <w-icon lg class="menu-btn pl5 pt2" title="Filtering on a store" v-if="storeFilter>0" v-on:click="updateStoreFilter(0)">mdi mdi-filter</w-icon>
    <ul class="menu sh3" v-if="showMenu1">
        <li>
            <span @mouseover="(e) => showMenu(e, 2)" v-on:click="(e) => showMenu(e, 2)" class="sub-menu-btn">Edit <span
                    class="crevron">></span></span>
            <w-transition-slide top>
                <ul class="sub-menu sh3" v-if="showMenu2">
                    <li v-on:click="edit('Categories')">Categories</li>
                    <li v-on:click="edit('Items')">Items</li>
                    <li v-on:click="edit('Stores')">Stores</li>
                </ul>
            </w-transition-slide>
        </li>
        <li>
            <span @mouseover="(e) => showMenu(e, 3)" v-on:click="(e) => showMenu(e, 3)" class="sub-menu-btn">My Lists <span
                    class="crevron">></span></span>
            <w-transition-slide top>
                <ul class="sub-menu sh3" v-if="showMenu3">
                    <li>Create a new List</li>
                    <li v-for="(list, index) in lists" :key="index" v-bind:class="{'menu-selected' : Number(this.$route.params.list_id)===Number(list.list_id)}" v-on:click="loadList(list.list_id)">
                        {{ list.name }}
                    </li>
                </ul>
            </w-transition-slide>
        </li>
        <li v-if="showListOptions" v-on:click="updateShowDone()">
            {{((showDone)?'Hide':'Show')}} Done
        </li>
        <li v-if="showListOptions">
            <span @mouseover="(e) => showMenu(e, 4)" v-on:click="(e) => showMenu(e, 4)" class="sub-menu-btn">Filter On <span
                    class="crevron">></span></span>
            <w-transition-slide top>
                <ul class="sub-menu sh3" v-if="showMenu4">
                    <li v-bind:class="{'menu-selected' : storeFilter===0}" v-on:click="updateStoreFilter(0)">Show All</li>
                    <li v-for="(store, index) in stores" :key="index" v-bind:class="{'menu-selected' : storeFilter===Number(store.store_id)}"  v-on:click="updateStoreFilter(store.store_id)">{{ store.name }}
                    </li>
                </ul>
            </w-transition-slide>
        </li>
        <li v-on:click="logout()">LogOut</li>
    </ul>
</template>
<script>
export default {
    props: {
        showListOptions: Boolean,
        showDone: Boolean,
        storeFilter: Number
    },
    data: () => ({
        lists: [],
        stores: [],
        showMenu1: false,
        showMenu2: false,
        showMenu3: false,
        showMenu4: false,
        menuTimeout: 0
    }),
    methods: {
        logout() {
            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
            this.$router.push({ name: "Login" });
        },
        updateStoreFilter(store_id) {
            window.localStorage.setItem("mygrocerylist-filter-storeFilter", JSON.stringify(store_id));
            this.$parent.updateStoreFilter(store_id);
        },
        edit(route) {
            this.$router.push({ name: route });
        },
        loadList(list_id) {
            this.$router.push({ name: "AddEditList", params: { list_id: list_id } });
            if (this.$route.params.list_id) {
                setTimeout(() => this.$router.go(), 10);
            }
        },
        hideMenu() {
            this.showMenu1 = false;
            this.showMenu2 = false;
            this.showMenu3 = false;
            this.showMenu4 = false;
            document.removeEventListener('click', this.hideMenu);
        },
        showMenu(e, id) {
            document.removeEventListener('click', this.hideMenu);
            clearTimeout(this.menuTimeout);
            this.menuTimeout = setTimeout(() => document.addEventListener('click', this.hideMenu), 1);
            this.showMenu2 = false;
            this.showMenu3 = false;
            this.showMenu4 = false;
            this['showMenu' + id] = true;
            e.preventDefault();
        },
        updateShowDone() {
            window.localStorage.setItem("mygrocerylist-filter-done", JSON.stringify(!this.showDone));
            this.$parent.updateShowDone(!this.showDone);
        }
    },
    mounted() {
        this.lists = JSON.parse(window.localStorage.getItem("mygrocerylist-lists"));
        this.stores = JSON.parse(window.localStorage.getItem("mygrocerylist-stores"))
    }
}
</script>
<style scoped>
.menu-btn {
    float: left;
    cursor: pointer;
}

ul {
    text-align: left;
    list-style-type: none;
}

.sub-menu {
    position: absolute;
    margin-left: 95px;
    margin-top: -20px;
    background-color: white;
    border: 1px solid #000;
    border-radius: 5px;
    z-index: 2;
}

.sub-menu-btn {
    display: block;
}
.menu-selected {
  background-image: linear-gradient(to right, #e4e4e4, #F7F7F7);
}
.crevron {
    margin-left: 10px;
    float: right;
}

.menu {
    float: left;
    position: absolute;
    left: 25px;
    background-color: white;
    border: 1px solid #000;
    border-radius: 2px;
    z-index: 2;
}

.menu li {
    padding: 10px 15px 5px 25px;
    white-space: nowrap;
}

.menu li:hover {
    cursor: pointer;
    background-color: #F5F5F5;
    border-radius: 4px;
}</style>