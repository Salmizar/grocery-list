<template>
    <li>
        <w-flex v-bind:class="{ 'white itemCategory': type === 'category' }" class="item">
            <div v-bind:class="{ 'open': editing }" class="xs12 shadowboxease">
                <div v-on:click="editItem" class="pl3 xs11 pointer pt2 pb2" title="Click to Edit">{{ name }}</div>
                <div class="xs1" v-if="type === 'category'">
                    <w-icon title="Move order up" class="pt3 pointer" v-if="index > 0" v-on:click="updateItemOrder(-1)"
                        lg>mdi
                        mdi-arrow-up-thick</w-icon>
                    <w-icon title="Move order down" v-if="index < (this.$parent.items.length - 1)"
                        v-on:click="updateItemOrder(1)" lg v-bind:class="{ 'pl11': index === 0 }"
                        class="pt3 pl5 pointer">mdi
                        mdi-arrow-down-thick</w-icon>
                </div>
            </div>
        </w-flex>
        <w-transition-expand y>
            <div v-if="editing">
                <AddEditMisc :item="item" :type="type" v-if="type != 'user'" :index="index" v-on:updateItem="updateItem"
                    v-on:deleteItem="deleteItem" />
                <AddEditUser :item="item" :type="type" v-if="type === 'user'" :index="index" v-on:updateItem="updateItem"
                    v-on:deleteItem="deleteItem" />
            </div>
        </w-transition-expand>
    </li>
</template>
<script>
import AddEditMisc from '@/views/AddEditMisc.vue';
import AddEditUser from '@/views/AddEditUser.vue';
//import axios from "axios";
export default {
    emits: [
        'updateItem',
        'deleteItem',
        'updateItemOrder'
    ],
    components: {
        AddEditMisc,
        AddEditUser
    },
    data: () => ({
        editing: false
    }),
    props: {
        type: String,
        name: String,
        item: Object,
        index: Number
    },
    methods: {
        updateItem(name, item, category, stores) {
            this.editing = false;
            this.$emit('updateItem', name, item, category, stores);
        },
        deleteItem(item) {
            this.editing = false;
            this.$emit('deleteItem', item);
        },
        updateItemOrder(direction) {
            this.$emit('updateItemOrder', direction, this.index, this.item);
        },
        editItem() {
            this.editing = !this.editing;
        }
    }
}
</script>
<style scoped>
li {
    border-top: 1px solid white;
}

@keyframes fadeIn {
    0% {
        opacity: 0
    }

    100% {
        opacity: 1;
    }
}

.pointer {
    cursor: pointer;
}

.item {
    animation: fadeIn 0.3s linear;
    white-space: nowrap;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.open {
    box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.2);
}

.shadowboxease {
    transition: box-shadow ease 0.4s;
    display: flex;
}

li {
    border-bottom: 1px solid darkgray;
}

.item:hover {
    background-color: #F5F5F5;
}

.itemCategory {
    background-color: #93c47d;
    font-weight: bold;
    text-shadow: 0 0 1px #000;
}

.itemCategory:hover {
    background-color: #a4ff96;
}
</style>