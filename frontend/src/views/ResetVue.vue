<template>
  <div class="send-reset-container">
    <logo-vue />
    <div class="send-reset-form sh3">
      <w-form v-model="valid">
        <section>
          <w-input maxlength="255" v-model="userEmail" class="ma1"
            :validators="[validators.required, validators.validEmail]">Email Address</w-input>
        </section>
        <w-alert v-if="requestSent" success light no-border>If there is an account associated with this email address, a
          reset email will be sent.</w-alert>
        <w-button class="ma1" xl bg-color="success" type="submit" :loading="submitloading"
          v-on:click="submitLoading()">Send
          password reset email</w-button>
      </w-form>
      <nav>
        Dont have an account? <router-link :to="{ name: 'Register' }">Register</router-link> now.
      </nav>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";
import LogoVue from "@/components/LogoVue.vue";
const submitloading = ref(false);
const requestSent = ref(false);
const userEmail = ref('');
const valid = ref(null);
const validators = {
  required: value => !!value || 'This field is required',
  validEmail: value => value.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || 'Invalid Email Address'
};
const submitLoading = () => {
  if (valid.value) {
    submitloading.value = true;
    requestSent.value = false;
    axios.get(process.env.VUE_APP_API_URL + '/api/sendreset/' + userEmail.value, { withCredentials: true })
      .then(() => {
        submitloading.value = false;
        requestSent.value = true;
      })
      .catch(() => {
        submitloading.value = false;
        requestSent.value = true;
      }
      );
  }
}
</script>
<style scoped>
.send-reset-container {
  text-align: center;
}
.send-reset-container input {
  text-align: left;
}
header {
  padding: 30px;
}
.send-reset-form {
  position: relative;
  left: 50%;
  margin-left: -180px;
  width: 360px;
  padding: 20px 30px 15px 30px;
  border: 1px solid lightgray;
  border-radius: 6px;
}
nav {
  padding-top: 20px;
  line-height: 1.5em;
}</style>