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
            v-on:click="this.$emit('cancelItem')">Cancel</w-button>&nbsp;
        <w-button v-if="type != 'new'" class="ma1" xl bg-color="warning" v-on:click="resetForm">Reset</w-button>&nbsp;
        <w-button class="ma1" xl bg-color="success" type="submit" :loading="submitloading"
            v-on:click="updateItem">Save</w-button>
    </w-form>
</template>

<script>
export default {
    emits: [
        'updateItem',
        'deleteItem',
        'cancelItem'
    ],
    data: () => ({
        name: '',
        valid: null,
        submitloading: false,
        validators: {
            required: value => !!value || "This field is required",
        },
        selectedCategory: [],
        categories: [
            { label: 'Example', value: 1 }
        ],
        selectedStores: [],
        stores: [
            { label: 'Example', value: 1 }
        ]
    }),
    props: {
        type: String,
        item: Object,
        index: Number
    },
    methods: {
        updateItem() {
            if (this.valid) {
                this.submitloading = true;
                if (this.type === 'items' || this.type === 'items-new') {
                    this.$emit('updateItem', this.name, this.item, this.selectedCategory, this.selectedStores);
                } else {
                    this.$emit('updateItem', this.name, this.item);
                }
            }
        },
        deleteItem() {
            this.submitloading = true;
            this.$emit('deleteItem', this.item);
        },
        resetForm() {
            this.submitloading = false;
            this.name = this.item.name;
            if (this.type === 'items') {
                this.selectedCategory = Number(this.item.category_id);
                this.selectedStores = new Array();
                if (this.item.store_ids) {
                    this.item.store_ids.split(",").map((iitem) => { this.selectedStores.push(Number(iitem)) });
                }
            } else if (this.type === 'items-new') {
                this.selectedCategory = [];
                this.selectedStores = [];
            }
        }
    },
    mounted() {
        if (this.type === 'items' || this.type === 'items-new') {
            let formattedCats = new Array();
            let cats = JSON.parse(window.localStorage.getItem("mygrocerylist-categories"));
            if (this.type === 'items') {
                this.selectedCategory = Number(this.item.category_id);
            } else {
                this.selectedCategory = Number(this.item.category_id);
            }
            for (let cat in cats) {
                formattedCats.push({ label: cats[cat].name, value: cats[cat].category_id });
            }
            this.categories = formattedCats;
            let formattedStores = new Array();
            let t_stores = JSON.parse(window.localStorage.getItem("mygrocerylist-stores"));
            if (this.type === 'items' && this.item.store_ids) {
                this.item.store_ids.split(",").map((iitem) => { this.selectedStores.push(Number(iitem)) });
            }
            for (let t_store in t_stores) {
                formattedStores.push({ label: t_stores[t_store].name, value: t_stores[t_store].store_id });
            }
            this.stores = formattedStores;
        }
        this.resetForm();
    }
}
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