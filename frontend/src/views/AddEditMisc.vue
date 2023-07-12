<template>
    <w-form v-model="valid" class="pl5 pb5 pt3 form">
        <section>
            <w-input maxlength="50" v-model="name" class="ma1 name" :validators="[validators.required]">Name</w-input>
        </section>
        <w-confirm v-if="type != 'new'" class="ma1" xl bg-color="error" right question="Are you sure?" v-on:confirm="deleteItem">Delete</w-confirm>
        <w-button v-if="type === 'new'" class="ma1" xl bg-color="error" @click="this.$emit('cancelItem')">Cancel</w-button>&nbsp;
        <w-button v-if="type!= 'new'" class="ma1" xl bg-color="warning" @click="resetForm">Reset</w-button>&nbsp;
        <w-button class="ma1" xl bg-color="success" type="submit" :loading="submitloading"
            @click="updateItem">Save</w-button>
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
        }
    }),
    props: {
        type: String,
        item: Object,
        index: Number
    },
    methods: {
        updateItem() {
            this.submitloading = true;
            this.$emit('updateItem', this.name, this.item);
        },
        deleteItem() {
            console.log('deleteItem');
            this.submitloading = true;
            this.$emit('deleteItem', this.item);
        },
        resetForm() {
            this.submitloading = false;
            this.name = this.item.name;
        }
    },
    mounted() {
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
</style>