<template>
  <div>
    <h1>Geannuleerde Bestellingen</h1>
    <button @click="emit('goBack')">Terug</button>
    <p v-if="filteredCancelledOrders.length === 0">
      Geen geannuleerde bestellingen gevonden.
    </p>
    <ul v-else>
      <li v-for="order in filteredCancelledOrders" :key="order._id">
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
        <hr />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from "vue";

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
</script>

<style scoped>
button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 1em;
}
hr {
  border: 1px solid #ccc;
}
</style>
