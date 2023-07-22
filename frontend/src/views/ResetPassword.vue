<template>
  <div class="reset-password-container">
    <logo-vue />
    <div class="reset-password-form sh3">
      <w-form v-model="valid">
        <section>
          <w-input maxlength="255" v-model="newPassword" class="ma1"
            :validators="[validators.required, validators.passwordLength]" type="password">New Password</w-input>
          <w-input maxlength="255" v-model="confirmPassword" class="ma1"
            :validators="[validators.required, validators.passwordMatch]" type="password">Confirm Password</w-input>
          <w-alert v-if="passwordReset" success light no-border>Your password has been reset, redirecting you to your
            account</w-alert>
        </section>
        <w-button class="ma1" xl bg-color="success" type="submit" :loading="submitloading"
          v-on:click="submitLoading()">{{ (route.query.new === 'true') ? 'Set' : 'Update' }} Password</w-button>
      </w-form>
      <nav>
        Already have an account? <router-link :to="{ name: 'Login' }">Login</router-link> now.
      </nav>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import LogoVue from "@/components/LogoVue.vue";
const router = useRouter();
const route = useRoute();
const confirmPassword = ref(process.env.VUE_APP_DEV_PASSWORD);
const newPassword = ref(process.env.VUE_APP_DEV_PASSWORD);
const submitloading = ref(false);
const passwordReset = ref(false);
const valid = ref(null);
const validators = ref({
  required: value => !!value || 'This field is required',
  passwordLength: value => value.length > 4 || 'Minimum password length, 5 characters',
  passwordMatch: value => value === newPassword.value || 'Passwords do not match'
});
const submitLoading = () => {
  if (valid.value) {
    submitloading.value = true;
    let data = {
      ...route.query,
      user_id: route.params.id,
      new_password: newPassword.value
    }
    axios.patch(process.env.VUE_APP_API_URL + '/api/reset/' + route.query.email, data, { withCredentials: true })
      .then(() => {
        passwordReset.value = true;
        setTimeout(() => {
          router.push({ name: 'Lists' });
        }, 1500);
      })
      .catch(error => {
        submitloading.value = false;
        if (error.response.status === 401) {
          router.push({ name: 'Login' });
        }
      });
  }
}
</script>
<style scoped>
.reset-password-container {
  text-align: center;
}

.reset-password-container input {
  text-align: left;
}

header {
  padding: 30px;
}
.reset-password-form {
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
}</style>