<template>
    <w-form v-model="valid" class="pl5 pb5 pt3 form">
        <section>
            <w-input maxlength="50" v-model="name" class="ma1 w275" :readonly="!canEdit"
                :validators="[validators.required]">Name</w-input>
            <w-input maxlength="255" v-model="userEmail" class="ma1 w275" :readonly="!canEdit"
                :validators="[validators.required, validators.validEmail]">Email Address</w-input>
            <w-input v-if="props.type != 'new' && item.user_id === user_id" maxlength="255" v-model="userPassword"
                class="ma1 w275" type="password">Optional Password Update</w-input>
        </section>
        <w-confirm v-if="props.type != 'new' && canEdit && item.user_id != user_id" class="ma1" xl bg-color="error" right
            question="Are you sure?" v-on:confirm="deleteItem">Delete</w-confirm>
        <w-button v-if="props.type === 'new' && canEdit" class="ma1" xl bg-color="error"
            v-on:click="emits('cancelItem')">Cancel</w-button>&nbsp;
        <w-button v-if="props.type != 'new' && canEdit" class="ma1" xl bg-color="warning"
            v-on:click="resetForm">Reset</w-button>&nbsp;
        <w-button class="ma1" xl bg-color="success" v-if="canEdit" type="submit" :loading="submitloading"
            v-on:click="updateItem">{{ (props.type === "user") ? 'Save' : 'Send Invite' }}</w-button>
    </w-form>
</template>

<script setup>
import { defineEmits, defineProps, ref, onMounted } from 'vue';
const name = ref('');
const userEmail = ref('');
const userPassword = ref('');
const canEdit = ref(false);
const user_id = ref(0);
const valid = ref(null);
const submitloading = ref(false);
const validators = {
    required: value => !!value || "This field is required",
    validEmail: value => value.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || "Invalid Email Address"
};
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
        emits('updateItem', props.item, name.value, userEmail.value, userPassword.value);
    }
};
const deleteItem = () => {
    submitloading.value = true;
    emits('deleteItem', props.item);
};
const resetForm = () => {
    submitloading.value = false;
    name.value = props.item.name;
    userEmail.value = props.item.email
};
onMounted(() => {
    if (window.$cookies.get('isAdmin') === 'true' || props.item.user_id === Number(window.$cookies.get('user_id'))) {
        canEdit.value = true;
    }
    user_id.value = Number(window.$cookies.get('user_id'));
    resetForm();
});
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