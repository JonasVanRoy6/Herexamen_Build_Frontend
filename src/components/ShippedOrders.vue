<template>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet"
  />
  <div>
    <h1>Verzonden Bestellingen</h1>
    <div class="button-container">
      <button @click="goBack" class="back-button">Terug</button>
      <button @click="deleteAllShippedOrders" class="delete-button">
        🗑️ Verwijder alles
      </button>
    </div>

    <ul>
      <li v-for="order in filteredOrders" :key="order._id">
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
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

// Emit events naar de oudercomponent
const emit = defineEmits(["goBack"]);

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

// Functie om terug te navigeren
function goBack() {
  emit("goBack");
}

// Ophalen van verzonden bestellingen bij het laden van de component
onMounted(async () => {
  try {
    const response = await fetch("http://localhost:5000/api/orders");
    if (!response.ok) throw new Error(`Status: ${response.status}`);
    const allOrders = await response.json();
    orders.value = allOrders.filter((order) => order.status === "shipped");
    console.log("Ophalen van verzonden orders:", orders.value); // Controleer de opgehaalde data
  } catch (err) {
    console.error("Fout bij ophalen:", err);
  }
});

const filteredOrders = computed(() => {
  return orders.value;
});

async function deleteAllShippedOrders() {
  try {
    const shippedOrderIds = orders.value.map((order) => order._id); // Gebruik orders.value in plaats van props.shippedOrders

    for (const orderId of shippedOrderIds) {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(
          `Fout bij het verwijderen van bestelling met ID ${orderId}`
        );
      }
      console.log(`Bestelling met ID ${orderId} verwijderd`);
    }

    // Verwijder alle bestellingen uit de lijst in de frontend
    orders.value = []; // Maak de orders.value-array leeg
  } catch (error) {
    console.error("Fout bij het verwijderen van de bestellingen:", error);
  }
}
</script>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
}
h1 {
  color: #ff69b4;
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
  color: #ff69b4;
  font-family: "Poppins", sans-serif;
}
.order-header {
  cursor: pointer;
  background-color: white;
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
.button-container {
  display: flex; /* Gebruik flexbox om de knoppen naast elkaar te plaatsen */
  justify-content: space-between; /* Zorg ervoor dat de knoppen aan de uiteinden staan */
  align-items: center; /* Zorg ervoor dat de knoppen verticaal gecentreerd zijn */
  margin-bottom: 20px; /* Voeg wat ruimte onder de container toe */
}

.back-button {
  font-family: "Poppins", sans-serif;
  font-size: 1.2rem;
  color: white;
  background-color: #ff69b4;
  border: 1px solid #ff69b4;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button {
  font-family: "Poppins", sans-serif;
  font-size: 1.2rem;
  color: white;
  background-color: #ff69b4;
  border: 1px solid #ff69b4;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 300px; /* Zorg ervoor dat de knop dezelfde breedte heeft als de andere knoppen */
}

/* Hover-effect voor beide knoppen */
button:hover {
  background-color: white;
  color: #ff69b4;
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
hr {
  border: 1px solid #ccc;
}
.accordion-arrow {
  font-size: 18px;
  color: #ff69b4;
}
</style>
