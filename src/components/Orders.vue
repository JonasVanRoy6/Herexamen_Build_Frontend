<template>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet"
  />
  <div>
    <h1>Bestellingen</h1>
    <button @click="goBack">Terug</button>

    <ul>
      <li v-for="order in filteredOrders" :key="order._id">
        <!-- Klantnaam en adres -->
        <div @click="toggleOrderDetails(order._id)" class="order-header">
          <p><strong>Bestelling ID:</strong> {{ order._id }}</p>
          <p v-if="order.customer && order.customer.name">
            <strong>Klantnaam:</strong> {{ order.customer.name }}
          </p>
          <p v-if="order.customer && order.customer.address">
            <strong>Adres:</strong> {{ order.customer.address.street }},
            {{ order.customer.address.city }}
          </p>
          <p v-else>Geen klantgegevens beschikbaar.</p>
          <!-- Pijl aan de rechterkant -->
          <span class="accordion-arrow">
            {{ expandedOrders.includes(order._id) ? "▼" : "▶" }}
          </span>
        </div>

        <!-- Uitklapbare details -->
        <div v-if="expandedOrders.includes(order._id)" class="order-details">
          <p><strong>Smaak:</strong></p>
          <ul v-if="order.flavors && order.flavors.length > 0">
            <li v-for="flavor in order.flavors" :key="flavor._id">
              - {{ getBolletjeName(flavor.name) }}:
              {{ getFlavorName(flavor.name, flavor.color) }}
            </li>
          </ul>
          <p v-else>Geen smaken beschikbaar voor deze bestelling.</p>
          <p><strong>Topping:</strong> {{ order.topping }}</p>
          <p><strong>Rietje:</strong> {{ order.straw }}</p>
          <p>
            <strong>Datum:</strong> {{ new Date(order.date).toLocaleString() }}
          </p>
          <button @click="markAsCancelled(order)">Annuleer</button>
          <button @click="markAsShipped(order)">Verzonden</button>
        </div>
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

const expandedOrders = ref([]);

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

// Functie om de details van een bestelling te tonen of te verbergen
function toggleOrderDetails(orderId) {
  if (expandedOrders.value.includes(orderId)) {
    // Verwijder de bestelling uit de lijst als deze al is uitgeklapt
    expandedOrders.value = expandedOrders.value.filter((id) => id !== orderId);
  } else {
    // Voeg de bestelling toe aan de lijst als deze niet is uitgeklapt
    expandedOrders.value.push(orderId);
  }
}

// Functie om uit te loggen

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
body {
  font-family: "Poppins", sans-serif;
}
h1 {
  color: black;
  font-family: "Poppins", sans-serif;
}
p {
  font-family: "Poppins", sans-serif;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
}
.order-header {
  cursor: pointer;
  background-color: #f9f9f9;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order-header:hover {
  background-color: #f0f0f0;
}
.order-details {
  padding: 10px;
  background-color: #fff;
}
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
hr {
  border: 1px solid #ccc;
}
.accordion-arrow {
  font-size: 18px;
  color: #333;
}
</style>
