<template>
  <div class="send-reset-container">
    <header>
      <img alt="App logo" width="48" height="65" src="../assets/logo.png">
      <h2>My Grocery List</h2>
    </header>
    <main class="send-reset-form sh3">
      <w-form v-model="valid">
        <section>
          <w-input maxlength="255" v-model="userEmail" class="ma1" :validators="[validators.required, validators.validEmail]">Email Address</w-input>
        </section>
        <w-alert v-if="requestSent" success light no-border>If there is an account associated with this email address, a
          reset email will be sent.</w-alert>
        <w-button class="ma1" xl bg-color="success" type="submit" :loading="submitloading" @click="submitLoading()">Send
          password reset email</w-button>
      </w-form>
      <nav>
        Dont have an account? <router-link :to="{ name: 'Register' }">Register</router-link> now.
      </nav>
    </main>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    submitloading: false,
    requestSent: false,
    userEmail: '',
    valid: null,
    validators: {
      required: value => !!value || 'This field is required',
      validEmail: value => value.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || 'Invalid Email Address'
    }
  }),
  methods: {
    submitLoading() {
      if (this.valid) {
        this.requestSent = true;
        this.submitloading = true;
        axios.get(process.env.VUE_APP_API_URL + '/api/reset/?email=' + this.userEmail, { withCredentials: true })
          .then(() => {
            this.submitloading = false;
          })
          .catch(error => {
            this.submitloading = false;
            if (error.response.status === 401) {
              this.isInvalidResult = true;
            }
          }
          );
      }
    }
  }
}
</script>
<style>
.send-reset-container {
  text-align: center;
}

.send-reset-container input {
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
  padding-top: 20px;
  line-height: 1.5em;
}</style>