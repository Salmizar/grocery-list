<template>
    <w-dialog :width="340" :persistent="true">
        <template #title>
            <w-icon class="mr2">mdi mdi-pencil</w-icon>
            {{ (props.list_id > 0) ? 'Edit' : 'Add a' }} List
        </template>
        <w-form v-model="valid" class="pl5 pb5 pt3 pr3">
            <section>
                <w-input maxlength="50" v-model="name" class="ma1 w275" :validators="[validators.required]">Name</w-input>
            </section>
            <w-confirm v-if="props.list_id != 0" class="ma1" xl bg-color="error" right question="Are you sure?"
                v-on:confirm="deleteItem">Delete</w-confirm>
            <w-button class="ma1" xl bg-color="warning" v-on:click="emits('cancelList')">Cancel</w-button>
            <w-button class="ma1" xl bg-color="success" type="submit" :loading="submitloading"
                v-on:click="updateItem">Save</w-button>
        </w-form>
    </w-dialog>
</template>
<script setup>
import { defineEmits, defineProps, ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import axios from "axios";
const router = useRouter();
const name = ref('');
const valid = ref(null);
const submitloading = ref(false);
const validators = {
    required: value => !!value || "This field is required"
};
const emits = defineEmits([
    'cancelList',
    'updateList'
]);
const props = defineProps({
    list_id: Number,
    list_name: String,
    lists: Object
});
const updateItem = () => {
    if (valid.value) {
        submitloading.value = true;
        if (props.list_id > 0) {
            axios.patch(process.env.VUE_APP_API_URL + '/api/lists/' + props.list_id,
                { name: name.value },
                { withCredentials: true }
            )
                .then((response) => {
                    if (response.status === 200) {
                        emits('updateList', 'update', props.list_id, name.value);
                    }
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        router.push({ name: 'Login' });
                    }
                });
        } else {
            axios.post(process.env.VUE_APP_API_URL + '/api/lists/',
                { name: name.value },
                { withCredentials: true }
            )
                .then((response) => {
                    if (response.status === 200) {
                        emits('updateList', 'new', response.data.list_id, response.data.name);
                    }
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        router.push({ name: 'Login' });
                    }
                });
        }
    }
};
const deleteItem = () => {
    if (props.lists.length === 1) {
        alert('You cannot delete your last remaining list');
    } else {
        submitloading.value = true;
        axios.delete(process.env.VUE_APP_API_URL + '/api/lists/' + props.list_id, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    emits('updateList', 'delete', props.list_id);
                }
            })
            .catch(error => {
                if (error.response.status === 401) {
                    router.push({ name: 'Login' });
                }
            });
    }
};
const resetForm = () => {
    submitloading.value = false;
    name.value = props.list_name;
};
onMounted(() => {
    name.value = props.list_name;
    resetForm();
});
</script>
<style scoped>
form {
    text-align: left;
}
</style>