<template>
    <li>
        <w-flex v-on:click="editItem" justify-space-between
            v-bind:class="{ 'success-light1--bg white itemCategory': type === 'category' }" class="pt2 pb2 pl3 pr3 item">
            <div>{{ name }}</div>
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
        'deleteItem'
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