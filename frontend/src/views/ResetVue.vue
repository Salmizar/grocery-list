<template>
  <div class="login-container">
    <header>
      <img alt="App logo" width="48" height="65" src="../assets/logo.png">
      <h2>My Grocery List</h2>
    </header>
    <main class="login-form sh3">
      <w-form v-model="valid">
        <section>
          <w-input class="ma1" :validators="[validators.required]">Email Address</w-input>
        </section>
        <w-button class="ma1" xl bg-color="info" type="submit" :loading="submitloading" @click="submitLoading()">Send password reset email</w-button>
      </w-form>
      <nav>
        Dont have an account? <router-link :to="{ name: 'Register' }">Register</router-link> now.
      </nav>
    </main>
  </div>
</template>

<style>
.login-container {
  text-align: center;
}

.login-form {
  height: 200px;
}

section {
  height: 80px;
}

header {
  padding: 30px;
}

main {
  position: relative;
  left: 50%;
  margin-left: -180px;
  width: 360px;
  padding: 30px;
  padding-top: 20px;
  border: 1px solid lightgray;
  border-radius: 6px;
}

nav {
  padding-top: 20px;
  line-height: 1.5em;
}

nav a {
  color: #42b983;
}
</style>
<script>
export default {
  data: () => ({
    submitloading: false,
    valid: null,
    validators: {
      required: value => !!value || 'This field is required'
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
