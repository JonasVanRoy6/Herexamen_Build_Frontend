<template>
  <div>
    <h1>Bestellingen</h1>
    <ul>
      <li v-for="order in orders" :key="order._id">
        <p><strong>Bestelling ID:</strong> {{ order._id }}</p>
        <p><strong>Smaak:</strong></p>
        <ul>
          <li v-for="flavor in order.flavors" :key="flavor._id">
            - {{ getBolletjeName(flavor.name) }}:
            {{ getFlavorName(flavor.color) }}
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

<script>
export default {
  data() {
    return {
      orders: [],
      flavorMap: {
        "#8b4513": "Chocolade",
        "#fffacd": "Vanille",
        "#ff6347": "Aardbei",
      },
      bolletjeMap: {
        sundae_1_1: "Bolletje 1",
        sundae_1_2: "Bolletje 2",
      },
    };
  },
  methods: {
    getFlavorName(color) {
      return this.flavorMap[color] || "Onbekend"; // Geef "Onbekend" als de kleur niet in de mapping staat
    },
    getBolletjeName(name) {
      return this.bolletjeMap[name] || name; // Geef de interne naam als er geen mapping is
    },
  },
  async created() {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      this.orders = await response.json();
    } catch (error) {
      console.error("Fout bij het ophalen van bestellingen:", error);
    }
  },
};
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
hr {
  border: 1px solid #ccc;
}
</style>
