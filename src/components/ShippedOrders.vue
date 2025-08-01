<template>
  <div>
    <h1>Verzonden Bestellingen</h1>
    <button @click="$emit('goBack')">Terug</button>
    <p v-if="orders.length === 0">Geen verzonden bestellingen gevonden.</p>
    <ul v-else>
      <li v-for="order in orders" :key="order._id">
        <p><strong>Bestelling ID:</strong> {{ order._id }}</p>
        <p><strong>Status:</strong> {{ order.status }}</p>
        <p><strong>Topping:</strong> {{ order.topping }}</p>
        <p><strong>Rietje:</strong> {{ order.straw }}</p>
        <p>
          <strong>Datum:</strong> {{ new Date(order.date).toLocaleString() }}
        </p>
        <hr />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from "vue";

// Props
const props = defineProps({
  orders: {
    type: Array,
    required: true,
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

// Filter de orders om alleen verzonden bestellingen weer te geven en sorteer ze
const filteredShippedOrders = computed(() => {
  if (!props.orders || props.orders.length === 0) {
    console.log("Geen orders ontvangen in props.");
    return [];
  }
  console.log("Ontvangen orders in props:", props.orders);
  return props.orders
    .filter((order) => order.status === "shipped")
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sorteer op datum, nieuwste eerst
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
