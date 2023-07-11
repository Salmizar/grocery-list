<template>
    <w-icon v-on:click="(e) => showMenu(e, 1)" lg class="menu-btn pl2 pt2">mdi mdi-menu</w-icon>
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
                    <li v-for="(list, index) in lists" :key="index" v-on:click="loadList(list.list_id)">
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
                    <li v-for="(store, index) in stores" :key="index" v-on:click="loadStore(list.store_id)">{{ store.name }}
                    </li>
                </ul>
            </w-transition-slide>
        </li>
        <li>LogOut</li>
    </ul>
</template>
<script>
export default {
    props: {
        showListOptions: Boolean,
        showDone: Boolean
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
        edit(route) {
            this.$router.push({ name: route });
        },
        loadList(list_id) {
            this.$router.push({ name: "AddEditList", params: { list_id: list_id } });
            setTimeout(() => this.$router.go(), 20);
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
            this.$parent.changeFilter(!this.showDone);
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
    margin-left: 90px;
    margin-top: -20px;
    background-color: white;
    border: 1px solid #000;
    border-radius: 5px;
    z-index: 2;
}

.sub-menu-btn {
    display: block;
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
    padding: 5px 10px 2px 20px;
    white-space: nowrap;
}

.menu li:hover {
    cursor: pointer;
    background-color: #F5F5F5;
    border-radius: 4px;
}</style>