<template>
  <div class="register-container">
    <logo-vue />
    <div class="register-form sh3">
      <w-form v-model="valid">
        <section>
          <w-input v-model="fullName" class="ma1" :validators="[validators.required]">Full Name</w-input>
          <w-input maxlength="255" v-if="!displayAccountName" readonly v-model="emailAddress" class="ma1"
            :validators="[validators.required, validators.validEmail]">Email Address</w-input>
          <!-- Duplicated email input fields, toggling visibility because waveui doesn't support readonly/disabled being set programatically -->
          <w-input maxlength="255" v-if="displayAccountName" v-model="emailAddress" class="ma1"
            :validators="[validators.required, validators.validEmail]">Email Address</w-input>
          <w-input maxlength="255" v-model="userPassword" class="ma1"
            :validators="[validators.required, validators.passwordLength]" type="password">Password</w-input>
          <w-input maxlength="50" v-if="displayAccountName" v-model="accountName" class="ma1"
            :validators="[validators.accountNameRequired]">Account Name</w-input>
        </section>
        <w-button class="ma1" xl bg-color="warning" type="reset" v-on:click="resetForm()">Reset</w-button>
        <w-button class="ma1" xl bg-color="success" type="submit" :loading="submitloading"
          v-on:click="submitLoading()">Register</w-button>
      </w-form>
      <nav>
        Already have an account? <router-link :to="{ name: 'Login' }">Login</router-link> now.
      </nav>
    </div>
  </div>
</template>
<script setup>
import { onMounted, defineProps, ref } from 'vue';
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import LogoVue from "@/components/LogoVue.vue";
const router = useRouter();
const route = useRoute();
const fullName = ref('');
const emailAddress = ref('');
const userPassword = ref(process.env.VUE_APP_DEV_PASSWORD);
const accountName = ref('My Grocery Lists');
const displayAccountName = ref(true);
const submitloading = ref(false);
const valid = ref(null);
const validators = {
  required: value => !!value || 'This field is required',
  accountNameRequired: value => this === undefined || props.id === undefined || !!value || 'This field is required',
  validEmail: value => value.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || 'Invalid Email Address',
  passwordLength: value => value.length > 4 || 'Minimum password length, 5 characters'
};
const props = defineProps({
  id: Number
})
const redirectToAccount = () => {
  router.push({ name: 'Lists' });
};
const resetForm = () => {
  submitloading.value = false;
  setTimeout(() => { emailAddress.value = route.query.email }, 1);
};
const submitLoading = () => {
  if (valid.value) {
    submitloading.value = true;
    let data = {
      name: fullName.value,
      password: userPassword.value
    }
    if (props.id) {//register to existing account
      data.user_id = props.id;
      data.auth_id = route.query.auth_id;
      data.account_id = route.query.account_id;
    } else {
      data.email = emailAddress.value;
      data.account_name = accountName.value;
    } axios.patch(process.env.VUE_APP_API_URL + '/api/register/',
      data,
      { withCredentials: true }
    )
      .then((response) => {
        submitloading.value = false;
        if (response.status === 200) {
          redirectToAccount();
        }
      })
      .catch(error => {
        submitloading.value = false;
        if (error.response.status === 401) {
          alert('UnAuthorized Error');
        }
      });
  }
};
onMounted(() => {
  emailAddress.value = route.query.email || '';
  displayAccountName.value = (props.id === undefined);
});
</script>
<style scoped>
.register-container {
  text-align: center;
}
.register-container input {
  text-align: left;
}
header {
  padding: 30px;
}
.register-form {
  position: relative;
  left: 50%;
  margin-left: -180px;
  width: 360px;
  padding: 20px 30px 15px 30px;
  border: 1px solid lightgray;
  border-radius: 6px;
}
nav {
  padding-top: 45px;
  line-height: 1.5em;
}
</style>