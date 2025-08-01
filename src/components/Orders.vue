<template>
  <div>
    <h1>Bestellingen</h1>
    <button @click="goBack">Terug</button>
    <button @click="logout">Uitloggen</button>
    <ul>
      <li v-for="order in filteredOrders" :key="order._id">
        <p><strong>Bestelling ID:</strong> {{ order._id }}</p>
        <p><strong>Smaak:</strong></p>
        <ul>
          <li v-for="flavor in order.flavors" :key="flavor._id">
            - {{ getBolletjeName(flavor.name) }}:
            {{ getFlavorName(flavor.name, flavor.color) }}
          </li>
        </ul>
        <p><strong>Topping:</strong> {{ order.topping }}</p>
        <p><strong>Rietje:</strong> {{ order.straw }}</p>
        <p>
          <strong>Datum:</strong> {{ new Date(order.date).toLocaleString() }}
        </p>
        <button @click="markAsCancelled(order)">Annuleer</button>
        <button @click="markAsShipped(order)">Verzonden</button>
        <hr />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

// Emit events naar de oudercomponent
const emit = defineEmits([
  "goBack",
  "logout",
  "updateCancelledOrders",
  "updateShippedOrders",
]);

// Data voor bestellingen
const orders = ref([]);
const flavorMap = {
  "#8b4513": "Chocolade",
  "#fffacd": "Vanille",
  "#ff69b4": "Aardbei",
};
const bolletjeMap = {
  sundae_1_1: "Bolletje 1",
  sundae_1_2: "Bolletje 2",
};

// Functies voor het ophalen van namen
function getFlavorName(name, color) {
  return (
    flavorMap[color] ||
    (name === "sundae_1_1"
      ? "Aardbei"
      : name === "sundae_1_2"
      ? "Chocolade"
      : "Onbekend")
  );
}

function getBolletjeName(name) {
  return bolletjeMap[name] || name;
}

// Functie om uit te loggen
function logout() {
  localStorage.removeItem("loggedIn");
  emit("logout");
}

// Functie om terug te navigeren
function goBack() {
  emit("goBack");
}

// Functie om een order te annuleren
async function markAsCancelled(order) {
  try {
    const response = await fetch(
      "http://localhost:5000/api/orders/updateStatus",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: order._id, status: "cancelled" }),
      }
    );

    if (!response.ok) {
      throw new Error("Fout bij het annuleren van de bestelling.");
    }

    // Update de status in de frontend
    order.status = "cancelled";
    orders.value = orders.value.filter((o) => o._id !== order._id);
    emit("updateCancelledOrders", order);
  } catch (error) {
    console.error("Fout bij annuleren:", error);
  }
}

// Functie om een order als verzonden te markeren
async function markAsShipped(order) {
  try {
    const response = await fetch(
      "http://localhost:5000/api/orders/updateStatus",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: order._id, status: "shipped" }),
      }
    );

    if (!response.ok) {
      throw new Error("Fout bij het markeren van de bestelling als verzonden.");
    }

    // Update de status in de frontend
    order.status = "shipped";
    orders.value = orders.value.filter((o) => o._id !== order._id);
    emit("updateShippedOrders", order);
  } catch (error) {
    console.error("Fout bij markeren als verzonden:", error);
  }
}

// Ophalen van bestellingen bij het laden van de component
onMounted(async () => {
  if (localStorage.getItem("loggedIn") === "true") {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      orders.value = await response.json();
      console.log("Ophalen van orders:", orders.value); // Controleer de opgehaalde data
    } catch (err) {
      console.error("Fout bij ophalen:", err);
    }
  }
});

const filteredOrders = computed(() => {
  return orders.value.filter((order) => order.status === "pending");
});
</script>

<style scoped>
h1 {
  color: #333;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 1em;
}
button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
hr {
  border: 1px solid #ccc;
}
</style>
