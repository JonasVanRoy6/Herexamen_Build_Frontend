<template>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet"
  />
  <div>
    <h1>Geannuleerde Bestellingen</h1>
    <button @click="emit('goBack')">Terug</button>

    <ul>
      <li v-for="order in filteredCancelledOrders" :key="order._id">
        <!-- Klantnaam en adres -->
        <div @click="toggleOrderDetails(order._id)" class="order-header">
          <p>
            <strong>Datum:</strong> {{ new Date(order.date).toLocaleString() }}
          </p>

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
          <p><strong>Topping:</strong> {{ order.topping || "geen" }}</p>
          <p><strong>Rietje:</strong> {{ order.straw }}</p>
          <p><strong>Bestelling ID:</strong> {{ order._id }}</p>
          <p><strong>Prijs:</strong> €{{ order.price }}</p>

          <button @click="deleteOrder(order._id)" class="delete-button">
            🗑️ Verwijderen
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

// Emit events naar de oudercomponent
const emit = defineEmits(["goBack"]);

// Props
const props = defineProps({
  cancelledOrders: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// Data voor smaken en bolletjes
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

// Filter de orders om alleen geannuleerde bestellingen weer te geven
const filteredCancelledOrders = computed(() => {
  return props.cancelledOrders
    .filter((order) => order.status === "cancelled")
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sorteer op datum, nieuwste eerst
});

// Functie om de details van een bestelling te tonen of te verbergen
function toggleOrderDetails(orderId) {
  if (expandedOrders.value.includes(orderId)) {
    expandedOrders.value = expandedOrders.value.filter((id) => id !== orderId);
  } else {
    expandedOrders.value.push(orderId);
  }
}

// Functie om een bestelling te verwijderen
async function deleteOrder(orderId) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/orders/${orderId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Fout bij het verwijderen van de bestelling");
    }
    console.log(`Bestelling met ID ${orderId} verwijderd`);

    // Verwijder de bestelling uit de lijst in de frontend
    props.cancelledOrders.splice(
      props.cancelledOrders.findIndex((order) => order._id === orderId),
      1
    );
  } catch (error) {
    console.error("Fout bij het verwijderen van de bestelling:", error);
  }
}
</script>

<style scoped>
.cancelled-orders {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f9f9f9;
}

h1 {
  font-family: "Poppins", sans-serif;
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
}
p {
  font-family: "Poppins", sans-serif;
  color: black;
}
ul {
  list-style-type: none;
  padding: 0;
  width: 100%;
  max-width: 100%;
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

.delete-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #ff1a1a;
}

.accordion-arrow {
  font-size: 18px;
  color: #333;
}
</style>
