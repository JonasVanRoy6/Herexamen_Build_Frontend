<template>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet"
  />
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
h1 {
  font-family: "Poppins", sans-serif;
  color: black;
  text-align: center;
  color: #ff69b4;
}
div {
  font-family: "Poppins", sans-serif;
  color: #ff69b4;
}

input {
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: #ff69b4;
  font-family: "Poppins", sans-serif;
}

button {
  font-family: "Poppins", sans-serif;
  background-color: #ff69b4;
  border: 1px solid #ff69b4;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
}
button:hover {
  background-color: white;
  color: #ff69b4; /* Lichtere roze kleur bij hover */
  border: 1px solid #ff69b4; /* Lichtere roze kleur bij hover */
}
</style>
