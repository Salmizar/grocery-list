<template>
    <w-dialog :width="340" :persistent="true">
        <template #title>
            <w-icon class="mr2">mdi mdi-pencil</w-icon>
            {{ (list_id > 0) ? 'Edit' : 'Add a' }} List
        </template>
        <w-form v-model="valid" class="pl5 pb5 pt3 pr3">
            <section>
                <w-input maxlength="50" v-model="name" class="ma1 w275" :validators="[validators.required]">Name</w-input>
            </section>
            <w-confirm v-if="list_id != 0" class="ma1" xl bg-color="error" right question="Are you sure?"
                v-on:confirm="deleteItem">Delete</w-confirm>
            <w-button class="ma1" xl bg-color="warning" v-on:click="this.$emit('cancelList')">Cancel</w-button>
            <w-button class="ma1" xl bg-color="success" type="submit" :loading="submitloading"
                v-on:click="updateItem">Save</w-button>
        </w-form>
    </w-dialog>
</template>
<script>
import axios from "axios";
export default {
    emits: [
        'cancelList',
        'updateList'
    ],
    data: () => ({
        name: '',
        valid: null,
        submitloading: false,
        validators: {
            required: value => !!value || "This field is required"
        }
    }),
    props: {
        list_id: Number,
        list_name: String,
        lists: Object
    },
    methods: {
        updateItem() {
            if (this.valid) {
                this.submitloading = true;
                if (this.list_id > 0) {
                    axios.patch(process.env.VUE_APP_API_URL + '/api/lists/'+ this.list_id,
                        { name: this.name },
                        { withCredentials: true }
                    )
                        .then((response) => {
                            if (response.status === 200) {
                                this.$emit('updateList', 'update', this.list_id, this.name);
                            }
                        })
                        .catch(error => {
                            if (error.response.status === 401) {
                                this.$router.push({ name: 'Login' });
                            }
                        });
                } else {
                    axios.post(process.env.VUE_APP_API_URL + '/api/lists/',
                        { name: this.name },
                        { withCredentials: true }
                    )
                        .then((response) => {
                            if (response.status === 200) {
                                this.$emit('updateList', 'new', response.data.list_id, response.data.name);
                            }
                        })
                        .catch(error => {
                            if (error.response.status === 401) {
                                this.$router.push({ name: 'Login' });
                            }
                        });
                }
            }
        },
        deleteItem() {
            if (this.lists.length === 1) {
                alert('You cannot delete your last remaining list');
            } else {
                this.submitloading = true;
                axios.delete(process.env.VUE_APP_API_URL + '/api/lists/' + this.list_id, { withCredentials: true })
                    .then((response) => {
                        if (response.status === 200) {
                            this.$emit('updateList','delete',this.list_id);
                        }
                    })
                    .catch(error => {
                        if (error.response.status === 401) {
                            this.$router.push({ name: 'Login' });
                        }
                    });
            }
        },
        resetForm() {
            this.submitloading = false;
            this.name = this.list_name;
        }
    },
    mounted() {
        this.name = this.list_name;
        this.resetForm();
    }
}
</script>
<style scoped>
form {
text-align: left;
}
</style>