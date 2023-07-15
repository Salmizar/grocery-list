<template>
  <div class="login-container">
    <logo-vue />
    <div class="login-form sh3">
      <w-form v-model="valid">
        <section>
          <w-input maxlength="255" v-model="userEmail" class="ma1"
            :validators="[validators.required, validators.validEmail]">Email
            Address</w-input>
          <w-input maxlength="255" v-model="userPassword" class="ma1" :validators="[validators.required]"
            type="password">Password</w-input>
          <w-alert v-if="isInvalidResult" error>Invalid Email Address or Password</w-alert>
          <div class="w-input__label w-form-el-shakable primary mt5" v-if="items.length > 0">Select an Account</div>
          <w-list v-if="items.length > 0" v-model="accountSelection" :items="items" :multiple="false"
            bg-color="green-light6" @item-click="selectAccount()" class="mt2 ml5 mr5 mb4 grow">
          </w-list>
        </section>
        <w-button class="ma1" xl bg-color="warning" type="reset" v-on:click="resetForm()">Reset</w-button>
        <w-button class="ma1" xl bg-color="success" type="submit" :loading="submitloading"
          v-on:click="submitLogin()">Login</w-button>
      </w-form>
      <nav>
        <router-link :to="{ name: 'Reset' }">Forgot Password</router-link><br>
        Dont have an account? <router-link :to="{ name: 'Register' }">Register</router-link> now.
      </nav>
    </div>
  </div>
</template>
<script>
import LogoVue from "@/components/LogoVue.vue";
import axios from "axios";
export default {
  components: { LogoVue },
  data: () => ({
    accountSelection: 0,
    items: [],
    isInvalidResult: false,
    userEmail: process.env.VUE_APP_DEV_EMAIL,
    userPassword: process.env.VUE_APP_DEV_PASSWORD,
    submitloading: false,
    valid: null,
    validators: {
      required: value => !!value || "This field is required",
      validEmail: value => value.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || "Invalid Email Address"
    }
  }),
  methods: {
    redirectToAccount() {
      this.$router.push({ name: "Lists" });
    },
    selectAccount() {
      this.submitloading = true;
      this.$cookies.set("account_id", this.accountSelection);
      this.redirectToAccount();
    },
    resetForm() {
      this.accountSelection = 0;
      this.items = [];
      this.isInvalidResult = false;
    },
    submitLogin() {
      if (this.valid) {
        this.submitloading = true;
        this.isInvalidResult = false;
        axios.patch(process.env.VUE_APP_API_URL + "/api/users/login/" + this.userEmail, { password: this.userPassword }, { withCredentials: true })
          .then((response) => {
            this.submitloading = false;
            if (response.status === 200) {
              if (response.data.account_users && response.data.account_users.length > 1) {
                for (var item in response.data.account_users) {
                  this.items.push({ label: response.data.account_users[item].account.name, value: response.data.account_users[item].account_id });
                }
              }
              else {
                this.redirectToAccount();
              }
            }
          })
          .catch(error => {
            this.submitloading = false;
            if (error.response.status === 401) {
              this.isInvalidResult = true;
            }
          });
      }
    }
  }
}
</script>
<style scoped>
.login-container {
  text-align: center;
}

.login-container input {
  text-align: left;
}

header {
  padding: 30px;
}

.login-form {
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
}
</style>
