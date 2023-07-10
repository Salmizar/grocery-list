<template>
  <div class="register-container">
    <logo-vue />
    <div class="register-form sh3">
      <w-form v-model="valid">
        <section>
          <w-input v-model="fullName" class="ma1" :validators="[validators.required]">Full Name</w-input>
          <w-input maxlength="255" v-if="!displayAccountName" readonly v-model="emailAddress" class="ma1" :validators="[validators.required, validators.validEmail]">Email Address</w-input>
          <!-- Duplicated email input fields, toggling visibility because waveui doesn't support readonly/disabled being set programatically -->
          <w-input maxlength="255" v-if="displayAccountName" v-model="emailAddress" class="ma1" :validators="[validators.required, validators.validEmail]">Email Address</w-input>
          <w-input maxlength="255" v-model="userPassword" class="ma1" :validators="[validators.required, validators.passwordLength]"
            type="password">Password</w-input>
          <w-input maxlength="50" v-if="displayAccountName" v-model="accountName" class="ma1" :validators="[validators.accountNameRequired]">Account Name</w-input>
        </section>
        <w-button class="ma1" xl bg-color="warning" type="reset" @click="resetForm()">Reset</w-button>
        <w-button class="ma1" xl bg-color="success" type="submit" :loading="submitloading"
          @click="submitLoading()">Register</w-button>
      </w-form>
      <nav>
        Already have an account? <router-link :to="{ name: 'Login' }">Login</router-link> now.
      </nav>
    </div>
  </div>
</template>
<script>
import LogoVue from "@/components/LogoVue.vue";
import axios from "axios";
export default {
  components: { LogoVue },
  props: ['id'],
  data: () => ({
    fullName: '',
    emailAddress: '',
    userPassword: process.env.VUE_APP_DEV_PASSWORD,
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
        let data = {
          name: this.fullName,
          password: this.userPassword
        }
        if (this.id) {//register to existing account
          data.user_id = this.id;
          data.auth_id = this.$route.query.auth_id;
          data.account_id = this.$route.query.account_id;
        } else {
          data.email = this.emailAddress;
          data.account_name = this.accountName;
        }
        axios.patch(process.env.VUE_APP_API_URL + '/api/register/',
          data,
          { withCredentials: true  }
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
}</style>