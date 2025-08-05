<template>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet"
  />
  <div class="status-selection">
    <h1>Kies een optie</h1>
    <button @click="$emit('navigateToOrders')">Te verwerken</button>
    <button @click="$emit('navigateToCancelledOrders')">Geannuleerd</button>
    <button @click="$emit('navigateToShippedOrders')">Verzonden</button>
    <button @click="logout">Uitloggen</button>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";

// Definieer de events die deze component kan verzenden
const emit = defineEmits([
  "logout",
  "navigateToOrders",
  "navigateToCancelledOrders",
  "navigateToShippedOrders",
]);

// Functie om uit te loggen
function logout() {
  localStorage.removeItem("loggedIn"); // Verwijder de loginstatus
  emit("logout"); // Verstuur het logout-event naar de oudercomponent
}
</script>

<style scoped>
/* Algemene styling voor de container */
.status-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Zorg ervoor dat het scherm volledig wordt bedekt */
  background-color: #f9f9f9; /* Lichtgrijze achtergrond */
}

/* Styling voor de titel */
h1 {
  font-family: "Poppins", sans-serif;
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
}

/* Styling voor de knoppen */
button {
  font-family: "Poppins", sans-serif;
  font-size: 1.2rem;
  color: black;
  background-color: white; /* Blauwe kleur */
  border: 1px solid black; /* Lichte rand */
  border-radius: 5px;
  padding: 10px 20px;
  margin: 10px 0; /* Ruimte tussen de knoppen */
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 200px; /* Zorg ervoor dat alle knoppen dezelfde breedte hebben */
  text-align: center;
}

/* Hover-effect voor de knoppen */
button:hover {
  background-color: black;
  color: white; /* Donkerdere blauwe kleur bij hover */
}
</style>
