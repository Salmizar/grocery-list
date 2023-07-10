<template>
  <div class="reset-password-container">
    <logo-vue />
    <div class="reset-password-form sh3">
      <w-form v-model="valid">
        <section>
          <w-input maxlength="255" v-model="newPassword" class="ma1" :validators="[validators.required, validators.passwordLength]" type="password">New Password</w-input>
          <w-input maxlength="255" v-model="confirmPassword" class="ma1" :validators="[validators.required, validators.passwordMatch]" type="password">Confirm Password</w-input>
          <w-alert v-if="passwordReset" success light no-border>Your password has been reset, redirecting you to your account</w-alert>
        </section>
        <w-button class="ma1" xl bg-color="success" type="submit" :loading="submitloading" @click="submitLoading()">Update Password</w-button>
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
  data() {
    return {
      confirmPassword: process.env.VUE_APP_DEV_PASSWORD,
      newPassword: process.env.VUE_APP_DEV_PASSWORD,
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
          let data = {
            ...this.$route.query,
            user_id: this.$route.params.id,
            new_password: this.newPassword
          }
          console.log(this.$route.params);
          axios.patch(process.env.VUE_APP_API_URL + '/api/reset/'+this.$route.query.email, data, { withCredentials: true })
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
}
</style>