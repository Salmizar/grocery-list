<template>
    <li>
        <w-flex justify-space-between
            v-bind:class="{ 'success-light1--bg white itemCategory': type === 'category' }" class="pt2 pb2 pl3 pr3 item">
            <div v-on:click="editItem" class="xs11">{{ name }}</div>
            <div class="xs1" v-if="type==='category'">
                <w-icon v-if="index>0" v-on:click="updateItemOrder(-1)" lg title="Move order up">mdi mdi-arrow-up-thick</w-icon>
                <w-icon v-if="index<(this.$parent.items.length-1)" v-on:click="updateItemOrder(1)" lg v-bind:class="{'pl11' : index===0}"
                class="pl5" title="Move order down">mdi mdi-arrow-down-thick</w-icon>
            </div>
        </w-flex>
        <w-transition-expand y>
            <div v-if="editing">
                <AddEditMisc :item="item" :type="type" :index="index" v-on:updateItem="updateItem" v-on:deleteItem="deleteItem" />
            </div>
        </w-transition-expand>
    </li>
</template>
<script>
import AddEditMisc from '@/views/AddEditMisc.vue';
//import axios from "axios";
export default {
    emits: [
        'updateItem',
        'deleteItem',
        'updateItemOrder'
    ],
    components: {
        AddEditMisc
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
        updateItem(name, item) {
            this.editing = false;
            this.$emit('updateItem', name, item);
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
    border-bottom: 1px solid white;
}

@keyframes fadeIn {
    0% {
        opacity: 0
    }

    100% {
        opacity: 1;
    }
}

.item {
    cursor: pointer;
    animation: fadeIn 0.3s linear;
    white-space: nowrap;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border-bottom: 1px solid darkgray;
}

.item:hover {
    background-color: #F5F5F5;
}

.itemCategory:hover {
    background-color: #a4ff96;
}
</style>