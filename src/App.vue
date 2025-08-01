<script setup>
import { ref, watch, onMounted } from "vue";
import Login from "./components/Login.vue";
import StatusSelection from "./components/StatusSelection.vue";
import Orders from "./components/Orders.vue";
import CancelledOrders from "./components/CancelledOrders.vue";
import ShippedOrders from "./components/ShippedOrders.vue";

// Loginstatus en view states
const isLoggedIn = ref(localStorage.getItem("loggedIn") === "true" || false);
const showStatusSelection = ref(false);
const showOrders = ref(false);
const showCancelledOrders = ref(false);
const showShippedOrders = ref(false);

// Data voor orders
const shippedOrders = ref([]);
const cancelledOrders = ref([]); // ✅ Toegevoegd
const orders = ref([]); // Zorg ervoor dat deze regel aanwezig is

// Synchroniseer loginstatus met localStorage
watch(isLoggedIn, (newValue) => {
  if (newValue) {
    localStorage.setItem("loggedIn", "true");
  } else {
    localStorage.removeItem("loggedIn");
  }
});

onMounted(async () => {
  try {
    console.log("Ophalen van orders gestart");
    const response = await fetch("http://localhost:5000/api/orders");
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    orders.value = await response.json();
    console.log("Ophalen van orders voltooid:", orders.value);
  } catch (err) {
    console.error("Fout bij ophalen van orders:", err);
    orders.value = [];
  }
});

function handleLogin() {
  isLoggedIn.value = true;
  showStatusSelection.value = true;
}

function handleNavigateToOrders() {
  showStatusSelection.value = false;
  showOrders.value = true;
}

function handleNavigateToCancelledOrders() {
  console.log("Navigeren naar geannuleerde bestellingen");
  showStatusSelection.value = false;
  showCancelledOrders.value = true;
}

function handleNavigateToShippedOrders() {
  console.log("Navigeren naar verzonden bestellingen");
  showStatusSelection.value = false;
  showShippedOrders.value = true;
  console.log("showShippedOrders:", showShippedOrders.value);
}

function handleLogout() {
  isLoggedIn.value = false;
  showStatusSelection.value = false;
  showOrders.value = false;
  showCancelledOrders.value = false;
  showShippedOrders.value = false;
  localStorage.removeItem("loggedIn");
}

function handleGoBack() {
  showStatusSelection.value = true;
  showOrders.value = false;
  showCancelledOrders.value = false;
  showShippedOrders.value = false;
}

function updateShippedOrders(order) {
  // Voeg de order toe aan de lijst van verzonden orders
  shippedOrders.value.push(order);

  // Verwijder de order uit de huidige lijst van orders
  orders.value = orders.value.filter((o) => o._id !== order._id);

  // Stuur een API-aanroep om de database bij te werken
  fetch("http://localhost:5000/api/orders/markAsShipped", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId: order._id }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Fout bij het markeren van de bestelling als verzonden."
        );
      }
      return response.json();
    })
    .then((data) => {
      console.log("Order gemarkeerd als verzonden:", data);
    })
    .catch((err) => console.error("Fout bij markeren als verzonden:", err));
}
</script>

<template>
  <div id="app">
    <!-- Loginpagina -->
    <Login v-if="!isLoggedIn" @login="handleLogin" />

    <!-- Statusselectiepagina -->
    <StatusSelection
      v-else-if="showStatusSelection"
      @navigateToOrders="handleNavigateToOrders"
      @navigateToCancelledOrders="handleNavigateToCancelledOrders"
      @navigateToShippedOrders="handleNavigateToShippedOrders"
    />

    <!-- Orderspagina -->
    <Orders
      v-else-if="showOrders"
      :orders="orders"
      @logout="handleLogout"
      @goBack="handleGoBack"
      @updateShippedOrders="updateShippedOrders"
    />

    <!-- Geannuleerde bestellingenpagina -->
    <CancelledOrders
      v-else-if="showCancelledOrders"
      :cancelledOrders="orders"
      @goBack="handleGoBack"
    />

    <!-- Verzonden bestellingenpagina -->
    <ShippedOrders
      v-else-if="showShippedOrders"
      :orders="orders"
      @goBack="handleGoBack"
    />
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
