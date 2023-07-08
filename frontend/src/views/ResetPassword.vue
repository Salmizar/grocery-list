<template>
  <div class="reset-password-container">
    <header>
      <img alt="App logo" width="48" height="65" src="../assets/logo.png">
      <h2>My Grocery List</h2>
    </header>
    <main class="reset-password-form sh3">
      <w-form v-model="valid">
        <section>
          <w-input maxlength="255" v-model="newPassword" class="ma1" :validators="[validators.required, validators.passwordLength]" type="password">New Password</w-input>
          <w-input maxlength="255" class="ma1" :validators="[validators.required, validators.passwordMatch]" type="password">Confirm Password</w-input>
          <w-alert v-if="passwordReset" success light no-border>Your password has been reset, redirecting you to your account</w-alert>
        </section>
        <w-button class="ma1" xl bg-color="success" type="submit" :loading="submitloading" @click="submitLoading()">Update Password</w-button>
      </w-form>
      <nav>
        Already have an account? <router-link :to="{ name: 'Login' }">Login</router-link> now.
      </nav>
    </main>
  </div>
</template>
<script>
import axios from "axios";
export default {
    props: ['id'],
  data() {
    return {
      newPassword: null,
      submitloading: false,
      passwordReset: false,
      valid: null,
      validators: {
        required: value => !!value || 'This field is required',
        passwordLength: value => value.length > 4 || 'Minimum password length, 5 characters',
        passwordMatch: value => value === this.newPassword || 'Passwords do not match'
      }
    }
  },
  methods: {
    submitLoading() {
      if (this.valid) {
          this.submitloading = true;
          let params = {
            ...this.$route.query,
            user_id: this.$route.params.id,
            new_password: this.newPassword
          }
          axios.get(process.env.VUE_APP_API_URL + '/api/reset/', { withCredentials: true , params: params })
          .then(() => {
            this.passwordReset = true;
            setTimeout(() => {
              this.$router.push({ name: 'Lists' });
            },2000);
          })
          .catch(error => {
            this.submitloading = false;
            if (error.response.status === 401) {
              this.$router.push({ name: 'Login' });
            }
          }
          );
      }
    }
  }
}
</script>
<style>
.reset-password-container {
  text-align: center;
}
.reset-password-container input {
  text-align: left;
}

header {
  padding: 30px;
}

main {
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
}
</style>