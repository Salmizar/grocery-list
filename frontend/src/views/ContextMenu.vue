<template>
    <div>
        <w-icon v-on:click="(e) => showMenu(e, 1)" lg class="pl2 pt3 floatl" title="Options menu">mdi mdi-menu</w-icon>
        <div v-if="props.storeFilter > 0" v-on:click="updateStoreFilter(0)" title="Remove Filter" class="pt1 ml3 floatl">
            <w-icon lg class="pt2 floatl error">mdi mdi-filter</w-icon>
            <div class="ml2 mt1 floatl fs11 error">
                {{ getStoreName(props.storeFilter) }}
            </div>
        </div>
        <ul class="menu" v-if="showMenu1">
            <li>
                <span @mouseover="(e) => showMenu(e, 2)" v-on:click="(e) => showMenu(e, 2)" class="sub-menu-btn">Edit <span
                        class="crevron">></span></span>
                <w-transition-slide top>
                    <ul class="sub-menu" v-if="showMenu2">
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
                    <ul class="sub-menu" v-if="showMenu3">
                        <li v-on:click="addNewList">Create a new List</li>
                        <li v-for="(list) in lists" :key="list.list_id"
                            v-bind:class="{ 'menu-selected': Number(route.params.list_id) === Number(list.list_id) }"
                            v-on:click="loadList(list.list_id)">
                            {{ list.name }}
                        </li>
                    </ul>
                </w-transition-slide>
            </li>
            <li v-if="props.showListOptions" v-on:click="updateShowDone()" class="sub-menu-btn">
                {{ ((props.showDone) ? 'Hide' : 'Show') }} Done
            </li>
            <li v-if="props.showListOptions">
                <span @mouseover="(e) => showMenu(e, 4)" v-on:click="(e) => showMenu(e, 4)" class="sub-menu-btn">Filter On
                    <span class="crevron">></span></span>
                <w-transition-slide top>
                    <ul class="sub-menu" v-if="showMenu4">
                        <li v-bind:class="{ 'menu-selected': props.storeFilter === 0 }" v-on:click="updateStoreFilter(0)">
                            Show All
                        </li>
                        <li v-for="(store) in stores" :key="store.store_id"
                            v-bind:class="{ 'menu-selected': props.storeFilter === Number(store.store_id) }"
                            v-on:click="updateStoreFilter(store.store_id)">{{ store.name }}
                        </li>
                    </ul>
                </w-transition-slide>
            </li>
            <li v-on:click="logout()" class="sub-menu-btn">LogOut</li>
        </ul>
        <AddEditList v-if="addEditList" :list_id="list_id" :list_name="list_name" :lists="lists" v-on:cancelList="editList"
            v-on:updateList="listsUpdated" />
    </div>
</template>
<script setup>
import { defineEmits, defineProps, ref, onMounted,defineExpose } from 'vue';
import { useRoute, useRouter } from "vue-router";
import AddEditList from '@/views/AddEditList.vue';
const router = useRouter();
const route = useRoute();
const lists = ref([]);
const stores = ref([]);
const addEditList = ref(false);
const list_name = ref('');
const list_id = ref(0);
const showMenu1 = ref(false);
const showMenu2 = ref(false);
const showMenu3 = ref(false);
const showMenu4 = ref(false);
let menuTimeout = 0;
const emits = defineEmits([
    'updateStoreFilter',
    'updateShowDone',
    'updateLists'
]);
const props = defineProps({
    showListOptions: Boolean,
    showDone: Boolean,
    storeFilter: Number
});
const editList = (id, name) => {
    list_id.value = id;
    list_name.value = name;
    addEditList.value = !addEditList.value;
};
const addNewList = () => {
    list_id.value = 0;
    list_name.value = '';
    addEditList.value = true;
};
const listsUpdated = (type, id) => {
    addEditList.value = false;
    switch (type) {
        case 'new':
            if (router.currentRoute._value.name != "AddEditList") {
                router.push({ name: "AddEditList", params: { list_id: id } });
            } else {
                emits('updateLists', id);
            }
            break;
        case 'update':
            emits('updateLists');
            break;
        default://delete
            emits('updateLists');
    }
};
const updateLists = () => {
    //listVue will call this after is resets local store with updated lists
    lists.value = JSON.parse(window.localStorage.getItem("mygrocerylist-lists"));
};
const getStoreName = (store_id) => {
    if (store_id > 0) {
        let store = stores.value.filter((store) => store.store_id === store_id)[0];
        //sometimes during dev, this would be null during site rebuild and cause app to crash, forcing a reload
        if (store) {
            return store.name;
        }
    }
    return '';
};
const logout = () => {
    document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    router.push({ name: "Login" });
};
const updateStoreFilter = (store_id) => {
    window.localStorage.setItem("mygrocerylist-filter-storeFilter", JSON.stringify(store_id));
    emits('updateStoreFilter', store_id);
};
const edit = (route) => {
    router.push({ name: route });
};
const loadList = (id) => {
    router.push({ name: "AddEditList", params: { list_id: id } });
    if (route.params.list_id) {
        setTimeout(() => router.go(), 10);
    }
};
const hideMenu = () => {
    showMenu1.value = false;
    showMenu2.value = false;
    showMenu3.value = false;
    showMenu4.value = false;
    document.removeEventListener('click', hideMenu);
};
const showMenu = (e, id) => {
    document.removeEventListener('click', hideMenu);
    clearTimeout(menuTimeout);
    menuTimeout = setTimeout(() => document.addEventListener('click', hideMenu), 1);
    showMenu1.value = true;
    showMenu2.value = (id ===2);
    showMenu3.value = (id ===3);
    showMenu4.value = (id ===4);
    e.preventDefault();
};
const updateShowDone = () => {
    window.localStorage.setItem("mygrocerylist-filter-done", JSON.stringify(!props.showDone));
    emits('updateShowDone', !props.showDone);
};
onMounted(() => {
    updateLists();
    stores.value = JSON.parse(window.localStorage.getItem("mygrocerylist-stores"));
});
defineExpose({
  updateLists,
  editList
});
</script>
<style scoped>
.floatl {
    float: left;
    cursor: pointer;
    font-weight: bold;
}
.fs11 {
    font-size: 14px;
    position: relative;
}
ul {
    text-align: left;
    list-style-type: none;
}
.sub-menu {
    position: absolute;
    margin-left: 120px;
    margin-top: -20px;
    background-color: rgb(var(--w-base-bg-color-rgb));
    border: 1px solid #000;
    border-radius: 5px;
    z-index: 2;
}
.sub-menu li {
    padding: 10px 15px 5px 25px;
}
.sub-menu-btn {
    display: block;
    padding: 10px 15px 5px 25px;
}
.menu-selected {
    background-image: linear-gradient(to right, rgba(200, 200, 200, 0.3), rgba(200, 200, 200, 0.1));
}
.crevron {
    margin-left: 10px;
    float: right;
}
.menu {
    float: left;
    position: absolute;
    left: 25px;
    top: 10px;
    background-color: rgb(var(--w-base-bg-color-rgb));
    border: 1px solid #000;
    border-radius: 2px;
    z-index: 2;
}
.menu li {
    white-space: nowrap;
}
.menu li:hover {
    cursor: pointer;
    background-color: rgba(200, 200, 200, 0.3);
    border-radius: 4px;
}</style>