<template>
    <li>
        <w-flex v-bind:class="{ 'white itemCategory': props.type === 'category' }" class="item">
            <div v-bind:class="{ 'open': editing }" class="xs12 shadowboxease">
                <div v-on:click="editItem" class="pl3 xs11 pointer pt2 pb2" title="Click to Edit">{{ name }}</div>
                <div class="xs1" v-if="props.type === 'category'">
                    <w-icon title="Move order up" class="pt3 pointer" v-if="props.index > 0"
                        v-on:click="updateItemOrder(-1)" lg>mdi
                        mdi-arrow-up-thick</w-icon>
                    <w-icon title="Move order down" v-if="!props.lastItem"
                        v-on:click="updateItemOrder(1)" lg v-bind:class="{ 'pl11': props.index === 0 }"
                        class="pt3 pl5 pointer">mdi
                        mdi-arrow-down-thick</w-icon>
                </div>
            </div>
        </w-flex>
        <w-transition-expand y>
            <div v-if="editing">
                <AddEditMisc :item="props.item" :type="props.type" v-if="props.type != 'user'" :index="props.index"
                    v-on:updateItem="updateItem" v-on:deleteItem="deleteItem" />
                <AddEditUser :item="props.item" :type="props.type" v-if="props.type === 'user'" :index="props.index"
                    v-on:updateItem="updateItem" v-on:deleteItem="deleteItem" />
            </div>
        </w-transition-expand>
    </li>
</template>
<script setup>
    import { defineEmits, defineProps, ref } from 'vue';
    import AddEditMisc from '@/views/AddEditMisc.vue';
    import AddEditUser from '@/views/AddEditUser.vue';
    const editing = ref(false);
    const emits = defineEmits([
        'updateItem',
        'deleteItem',
        'updateItemOrder'
    ]);
    const props = defineProps({
        type: String,
        name: String,
        item: Object,
        index: Number,
        lastItem: Boolean
    });
    const updateItem = (name, item, category, stores) => {
        editing.value = false;
        emits('updateItem', name, item, category, stores);
    };
    const deleteItem = (item) => {
        editing.value = false;
        emits('deleteItem', item);
    };
    const updateItemOrder = (direction) => {
        emits('updateItemOrder', direction, props.index, props.item);
    };
    const editItem = () => {
        editing.value = !editing.value;
    };
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