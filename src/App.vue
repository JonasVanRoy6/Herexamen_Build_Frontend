<script setup>
import { ref, watch } from "vue";
import Login from "./components/Login.vue";
import StatusSelection from "./components/StatusSelection.vue";
import Orders from "./components/Orders.vue";

// Synchroniseer de loginstatus met localStorage
const isLoggedIn = ref(localStorage.getItem("loggedIn") === "true");
const showStatusSelection = ref(false);

// Zorg ervoor dat wijzigingen in isLoggedIn worden opgeslagen in localStorage
watch(isLoggedIn, (newValue) => {
  if (newValue) {
    localStorage.setItem("loggedIn", "true");
  } else {
    localStorage.removeItem("loggedIn");
  }
});

function handleLogin() {
  isLoggedIn.value = true;
  showStatusSelection.value = true; // Toon het keuzescherm na inloggen
}

function handleNavigateToOrders() {
  showStatusSelection.value = false; // Verberg het keuzescherm
}

function handleLogout() {
  isLoggedIn.value = false;
  showStatusSelection.value = false;
  localStorage.removeItem("loggedIn");
}

function handleGoBack() {
  showStatusSelection.value = true; // Toon het keuzescherm
}
</script>

<template>
  <div id="app">
    <Login v-if="!isLoggedIn" @login="handleLogin" />
    <StatusSelection
      v-else-if="showStatusSelection"
      @navigateToOrders="handleNavigateToOrders"
    />
    <Orders v-else @logout="handleLogout" @goBack="handleGoBack" />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
