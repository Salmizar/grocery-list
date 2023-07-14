<template>
    <w-form v-model="valid" class="pl5 pb5 pt3 form">
        <section>
            <w-input maxlength="50" v-model="name" class="ma1 w275" :validators="[validators.required]">Name</w-input>
            <w-input maxlength="255" v-model="userEmail" class="ma1 w275" :validators="[validators.required, validators.validEmail]">Email Address</w-input>
            <w-input v-if="type != 'new' && item.user_id === user_id" maxlength="255" v-model="userPassword" class="ma1 w275" :validators="[validators.required]" type="password">Password</w-input>
        </section>
        <w-confirm v-if="type != 'new' && item.user_id != user_id" class="ma1" xl bg-color="error" right question="Are you sure?" v-on:confirm="deleteItem">Delete</w-confirm>
        <w-button v-if="type === 'new'" class="ma1" xl bg-color="error" @click="this.$emit('cancelItem')">Cancel</w-button>&nbsp;
        <w-button v-if="type != 'new'" class="ma1" xl bg-color="warning" @click="resetForm">Reset</w-button>&nbsp;
        <w-button class="ma1" xl bg-color="success" type="submit" :loading="submitloading" @click="updateItem">{{(type==="user")?'Save':'Send Invite'}}</w-button>
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
        userEmail: '',
        userPassword: '',
        user_id: 0,
        valid: null,
        submitloading: false,
        validators: {
            required: value => !!value || "This field is required",
            validEmail: value => value.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || "Invalid Email Address"
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
            this.$emit('updateItem', this.name, this.userEmail, this.userPassword);
        },
        deleteItem() {
            this.submitloading = true;
            this.$emit('deleteItem', this.item);
        },
        resetForm() {
            this.submitloading = false;
            this.name = this.item.name;
            this.userEmail = this.item.email
        }
    },
    mounted() {
        this.user_id = Number(window.$cookies.get('user_id'));
        this.resetForm();
    }
}
</script>
<style scoped>
h3 {
    border-bottom: 1px solid darkgray;
}

.w275 {
    width: 275px;
}

.form {
    box-shadow: inset 0px -6px 11px -6px rgba(0, 0, 0, 0.2);
    transition: box-shadow ease 0.4s;
}
</style>