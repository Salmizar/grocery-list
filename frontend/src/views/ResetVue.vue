<template>
  <div class="send-reset-container">
    <header>
      <img alt="App logo" width="48" height="65" src="../assets/logo.png">
      <h2>My Grocery List</h2>
    </header>
    <main class="send-reset-form sh3">
      <w-form v-model="valid">
        <section>
          <w-input class="ma1" :validators="[validators.required]">Email Address</w-input>
        </section>
        <w-button class="ma1" xl bg-color="success" type="submit" :loading="submitloading" @click="submitLoading()">Send password reset email</w-button>
      </w-form>
      <nav>
        Dont have an account? <router-link :to="{ name: 'Register' }">Register</router-link> now.
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
}
</style>