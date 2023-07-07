<template>
  <div class="register-container">
    <header>
      <img alt="App logo" width="48" height="65" src="../assets/logo.png">
      <h2>My Grocery List</h2>
    </header>
    <main class="register-form sh3">
      <w-form v-model="valid">
        <section>
          <w-input v-model="fullName" class="ma1" :validators="[validators.required]">Full Name</w-input>
          <w-input v-if="!displayAccountName" readonly v-model="emailAddress" class="ma1" :validators="[validators.required, validators.validEmail]">Email Address</w-input>
          <!-- Duplicated email input fields, toggling visibility because waveui doesn't support readonly/disabled being set programatically -->
          <w-input v-if="displayAccountName" v-model="emailAddress" class="ma1" :validators="[validators.required, validators.validEmail]">Email Address</w-input>
          <w-input v-model="userPassword" class="ma1" :validators="[validators.required, validators.passwordLength]"
            type="password">Password</w-input>
          <w-input v-if="displayAccountName" v-model="accountName" class="ma1" :validators="[validators.accountNameRequired]">Account Name</w-input>
        </section>
        <w-button class="ma1" xl bg-color="warning" type="reset" @click="resetForm()">Reset</w-button>
        <w-button class="ma1" xl bg-color="success" type="submit" :loading="submitloading"
          @click="submitLoading()">Register</w-button>
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
  data: () => ({
    fullName: '',
    emailAddress: '',
    userPassword: '',
    accountName: 'My Grocery Lists',
    displayAccountName: true,
    submitloading: false,
    valid: null,
    validators: {
      required: value => !!value || 'This field is required',
      accountNameRequired: value => this === undefined || this.id === undefined || !!value || 'This field is required',
      validEmail: value => value.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || 'Invalid Email Address',
      passwordLength: value => value.length > 4 || 'Minimum password length, 5 characters'
    }
  }),
  methods: {
    redirectToAccount() {
      this.$router.push({ name: 'Lists' });
    },
    resetForm() {
        this.submitloading = false;
        setTimeout(() => {this.emailAddress = this.$route.query.email }, 1);
    },
    submitLoading() {
      if (this.valid) {
        this.submitloading = true;
        let params = {
          name: this.fullName,
          password: this.userPassword
        }
        if (this.id) {
          params.user_id = this.id;
          params.auth_id = this.$route.query.auth_id;
          params.account_id = this.$route.query.account_id;
        } else {
          params.email = this.emailAddress;
          params.account_name = this.accountName;
        }
        axios.get(process.env.VUE_APP_API_URL + '/api/register/',
          { withCredentials: true, params: params }
        )
          .then((response) => {
            this.submitloading = false;
            if (response.status === 200) {
              this.redirectToAccount();
            }
          })
          .catch(error => {
            this.submitloading = false;
            if (error.response.status === 401) {
              alert('UnAuthorized Error');
            }
          });
      }
    }
  },
  mounted() {
    this.emailAddress = this.$route.query.email || '';
    this.displayAccountName = (this.id===undefined);
  }
}
</script>
<style>
.register-container {
  text-align: center;
}

.register-container input {
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
  line-height: 1.5em;
}</style>