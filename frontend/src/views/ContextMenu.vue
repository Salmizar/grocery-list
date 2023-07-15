<template>
    <div>
        <w-icon v-on:click="(e) => showMenu(e, 1)" lg class="menu-btn pl2 pt2">mdi mdi-menu</w-icon>
        <w-icon lg class="menu-btn pl5 pt2" title="Remove Filter" v-if="storeFilter > 0"
            v-on:click="updateStoreFilter(0)">mdi
            mdi-filter</w-icon>
        <div class="menu-btn ml3 mt2" v-on:click="updateStoreFilter(0)" title="Remove Filter">{{ getStoreName(storeFilter)
        }}
        </div>
        <ul class="menu sh3" v-if="showMenu1">
            <li>
                <span @mouseover="(e) => showMenu(e, 2)" v-on:click="(e) => showMenu(e, 2)" class="sub-menu-btn">Edit <span
                        class="crevron">></span></span>
                <w-transition-slide top>
                    <ul class="sub-menu sh3" v-if="showMenu2">
                        <li v-on:click="edit('Categories')">Categories</li>
                        <li v-on:click="edit('Items')">Items</li>
                        <li v-on:click="edit('Stores')">Stores</li>
                        <li v-on:click="edit('Users')">Users</li>
                    </ul>
                </w-transition-slide>
            </li>
            <li>
                <span @mouseover="(e) => showMenu(e, 3)" v-on:click="(e) => showMenu(e, 3)" class="sub-menu-btn">My Lists
                    <span class="crevron">></span></span>
                <w-transition-slide top>
                    <ul class="sub-menu sh3" v-if="showMenu3">
                        <li v-on:click="addNewList">Create a new List</li>
                        <li v-for="(list) in lists" :key="list.list_id"
                            v-bind:class="{ 'menu-selected': Number(this.$route.params.list_id) === Number(list.list_id) }"
                            v-on:click="loadList(list.list_id)">
                            {{ list.name }}
                        </li>
                    </ul>
                </w-transition-slide>
            </li>
            <li v-if="showListOptions" v-on:click="updateShowDone()">
                {{ ((showDone) ? 'Hide' : 'Show') }} Done
            </li>
            <li v-if="showListOptions">
                <span @mouseover="(e) => showMenu(e, 4)" v-on:click="(e) => showMenu(e, 4)" class="sub-menu-btn">Filter On
                    <span class="crevron">></span></span>
                <w-transition-slide top>
                    <ul class="sub-menu sh3" v-if="showMenu4">
                        <li v-bind:class="{ 'menu-selected': storeFilter === 0 }" v-on:click="updateStoreFilter(0)">Show All
                        </li>
                        <li v-for="(store) in stores" :key="store.store_id"
                            v-bind:class="{ 'menu-selected': storeFilter === Number(store.store_id) }"
                            v-on:click="updateStoreFilter(store.store_id)">{{ store.name }}
                        </li>
                    </ul>
                </w-transition-slide>
            </li>
            <li v-on:click="logout()">LogOut</li>
        </ul>
        <AddEditList v-if="addEditList" :list_id="list_id" :list_name="list_name" :lists="lists" v-on:cancelList="editList"
            v-on:updateList="listsUpdated" />
    </div>
</template>
<script>
import AddEditList from '@/views/AddEditList.vue';
export default {
    components: {
        AddEditList
    },
    emits: [
        'updateStoreFilter',
        'updateShowDone',
        'updateLists'
    ],
    props: {
        showListOptions: Boolean,
        showDone: Boolean,
        storeFilter: Number
    },
    data: () => ({
        lists: [],
        stores: [],
        addEditList: false,
        list_name: '',
        list_id: 0,
        showMenu1: false,
        showMenu2: false,
        showMenu3: false,
        showMenu4: false,
        menuTimeout: 0
    }),
    methods: {
        editList(list_id, list_name) {
            this.list_id = list_id;
            this.list_name = list_name;
            this.addEditList = !this.addEditList;
        },
        addNewList() {
            this.list_id = 0;
            this.list_name = '';
            this.addEditList = true;
        },
        listsUpdated(type, list_id) {
            this.addEditList = false;
            switch (type) {
                case 'new':
                    if (this.$router.currentRoute._value.name != "AddEditList") {
                        this.$router.push({ name: "AddEditList", params: { list_id: list_id } });
                    } else {
                        this.$emit('updateLists', list_id);
                    }
                    break;
                case 'update':
                    this.$emit('updateLists');
                    break;
                default://delete
                    this.$emit('updateLists');
            }
        },
        updateLists() {
            //listVue will call this after is resets local store with updated lists
            this.lists = JSON.parse(window.localStorage.getItem("mygrocerylist-lists"));
        },
        getStoreName(store_id) {
            if (store_id > 0) {
                let store = this.stores.filter((store) => store.store_id === store_id)[0];
                //sometimes during dev, this would be null during site rebuild and cause app to crash, forcing a reload
                if (store) {
                    return store.name;
                }
            }
            return '';
        },
        logout() {
            document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
            this.$router.push({ name: "Login" });
        },
        updateStoreFilter(store_id) {
            window.localStorage.setItem("mygrocerylist-filter-storeFilter", JSON.stringify(store_id));
            this.$emit('updateStoreFilter', store_id);
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
            this.$emit('updateShowDone', !this.showDone);
        }
    },
    mounted() {
        this.updateLists();
        this.stores = JSON.parse(window.localStorage.getItem("mygrocerylist-stores"));
    }
}
</script>
<style scoped>
.menu-btn {
    float: left;
    cursor: pointer;
    z-index: 10;
}

div.menu-btn {
    font-size: 11px;
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
}
</style>