<template>
  <div>
    <h1>Inloggen</h1>
    <form @submit.prevent="login">
      <label for="username">Gebruikersnaam:</label>
      <input type="text" id="username" v-model="username" required />

      <label for="password">Wachtwoord:</label>
      <input type="password" id="password" v-model="password" required />

      <button type="submit">Inloggen</button>
    </form>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      error: null,
    };
  },
  methods: {
    login() {
      if (this.username === "admin" && this.password === "admin") {
        console.log("Inloggen succesvol");
        localStorage.setItem("loggedIn", "true");
        console.log(
          "loggedIn status opgeslagen in localStorage:",
          localStorage.getItem("loggedIn")
        );
        this.$emit("login"); // Verstuur een event naar de oudercomponent
      } else {
        this.error = "Ongeldige gebruikersnaam of wachtwoord.";
      }
    },
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: auto;
}
label {
  margin-top: 10px;
}
button {
  margin-top: 20px;
}
</style>
