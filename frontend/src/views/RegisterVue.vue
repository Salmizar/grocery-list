<template>
  <div class="register-container">
    <header>
      <img alt="App logo" width="48" height="65" src="../assets/logo.png">
      <h2>My Grocery List</h2>
    </header>
    <main class="register-form sh3">
      <w-form v-model="valid">
        <section>
          <w-input class="ma1" :validators="[validators.required]">Full Name</w-input>
          <w-input class="ma1" :validators="[validators.required, validators.validEmail]">Email Address</w-input>
          <w-input class="ma1" :validators="[validators.required, validators.passwordLength]" type="password">Password</w-input>
          <w-input class="ma1" :validators="[validators.required]" model-value="My Grocery Lists">Account Name</w-input>
        </section>
        <w-button class="ma1" xl bg-color="warning" type="reset">Reset</w-button>
        <w-button class="ma1" xl bg-color="success"  type="submit" :loading="submitloading" @click="submitLoading()">Register</w-button>
      </w-form>
      <nav>
        Already have an account? <router-link :to="{ name: 'Login' }">Login</router-link> now.
      </nav>
    </main>
  </div>
</template>
<script>
export default {
  data: () => ({
    submitloading: false,
    valid: null,
    validators: {
      required: value => !!value || 'This field is required',
      validEmail: value => value.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || 'Invalid Email Address',
      passwordLength: value => value.length>4 || 'Minimum password length, 5 characters'
    }
  }),
  methods: {
  submitLoading () {
    if (this.valid) {
      this.submitloading = true;
      setTimeout(() => (this.submitloading = false), 3000);
    }
  }
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
}
</style>