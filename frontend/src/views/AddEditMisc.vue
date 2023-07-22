<template>
    <w-form v-model="valid" class="pl5 pb5 pt3 form">
        <section>
            <w-input maxlength="50" v-model="name" class="ma1 name" :validators="[validators.required]">Name</w-input>
            <div v-if="type === 'items' || type === 'items-new'" class="pb5">
                <w-select v-model="selectedCategory" :items="categories" class="name pt2 pb6" outline
                    placeholder="Select a category">Optional
                    Category</w-select>
                <w-checkboxes class="pl3" v-model="selectedStores" :items="stores"></w-checkboxes>
            </div>
        </section>
        <w-confirm v-if="type != 'new'" class="ma1" xl bg-color="error" right question="Are you sure?"
            v-on:confirm="deleteItem">Delete</w-confirm>
        <w-button v-if="type === 'new'" class="ma1" xl bg-color="error"
            v-on:click="emits('cancelItem')">Cancel</w-button>&nbsp;
        <w-button v-if="type != 'new'" class="ma1" xl bg-color="warning" v-on:click="resetForm">Reset</w-button>&nbsp;
        <w-button class="ma1" xl bg-color="success" type="submit" :loading="submitloading"
            v-on:click="updateItem">Save</w-button>
    </w-form>
</template>

<script setup>
import { defineEmits, defineProps, ref, onMounted } from 'vue';
const name = ref('');
const valid = ref(null);
const submitloading = ref(false);
const validators = {
    required: value => !!value || "This field is required",
};
const selectedCategory = ref([]);
const categories = ref([
    { label: 'Example', value: 1 }
]);
const selectedStores = ref([]);
const stores = ref([
    { label: 'Example', value: 1 }
]);
const emits = defineEmits([
    'updateItem',
    'deleteItem',
    'cancelItem'
]);
const props = defineProps({
    type: String,
    item: Object,
    index: Number
});
const updateItem = () => {
    if (valid.value) {
        submitloading.value = true;
        if (props.type === 'items' || props.type === 'items-new') {
            emits('updateItem', name.value, props.item, selectedCategory.value, selectedStores.value);
        } else {
            emits('updateItem', name.value, props.item);
        }
    }
};
const deleteItem = () => {
    submitloading.value = true;
    emits('deleteItem', props.item);
};
const resetForm = () => {
    submitloading.value = false;
    name.value = props.item.name;
    if (props.type === 'items') {
        selectedCategory.value = Number(props.item.category_id);
        selectedStores.value = new Array();
        if (props.item.store_ids) {
            props.item.store_ids.split(",").map((item) => { selectedStores.value.push(Number(item)) });
        }
    } else if (props.type === 'items-new') {
        selectedCategory.value = [];
        selectedStores.value = [];
    }
};
onMounted(() => {
    if (props.type === 'items' || props.type === 'items-new') {
        let formattedCats = new Array();
        let cats = JSON.parse(window.localStorage.getItem("mygrocerylist-categories"));
        if (props.type === 'items') {
            selectedCategory.value = Number(props.item.category_id);
        } else {
            selectedCategory.value = Number(props.item.category_id);
        }
        for (let cat in cats) {
            formattedCats.push({ label: cats[cat].name, value: cats[cat].category_id });
        }
        categories.value = formattedCats;
        let formattedStores = new Array();
        let t_stores = JSON.parse(window.localStorage.getItem("mygrocerylist-stores"));
        if (props.type === 'items' && props.item.store_ids) {
            props.item.store_ids.split(",").map((item) => { selectedStores.value.push(Number(item)) });
        }
        for (let t_store in t_stores) {
            formattedStores.push({ label: t_stores[t_store].name, value: t_stores[t_store].store_id });
        }
        stores.value = formattedStores;
    }
    resetForm();
});
</script>
<style scoped>
h3 {
    border-bottom: 1px solid darkgray;
}
.name {
    width: 275px;
}
.form {
    box-shadow: inset 0px -6px 11px -6px rgba(0, 0, 0, 0.2);
    transition: box-shadow ease 0.4s;
}
</style>