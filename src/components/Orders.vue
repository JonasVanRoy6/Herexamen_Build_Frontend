<template>
  <div>
    <h1>Bestellingen</h1>
    <button @click="goBack">Terug</button>
    <button @click="logout">Uitloggen</button>
    <ul>
      <li v-for="order in orders" :key="order._id">
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

<script>
export default {
  data() {
    return {
      orders: [],
      cancelledOrders: [], // Lijst voor geannuleerde bestellingen
      shippedOrders: [], // Lijst voor verzonden bestellingen
      isLoggedIn: false,
      flavorMap: {
        "#8b4513": "Chocolade",
        "#fffacd": "Vanille",
        "#ff69b4": "Aardbei",
      },
      bolletjeMap: {
        sundae_1_1: "Bolletje 1",
        sundae_1_2: "Bolletje 2",
      },
    };
  },
  methods: {
    getFlavorName(name, color) {
      if (this.flavorMap[color]) {
        return this.flavorMap[color];
      }
      if (name === "sundae_1_1") {
        return "Aardbei";
      } else if (name === "sundae_1_2") {
        return "Chocolade";
      }
      return "Onbekend";
    },
    getBolletjeName(name) {
      return this.bolletjeMap[name] || name;
    },
    logout() {
      localStorage.removeItem("loggedIn");
      this.$emit("logout");
    },
    goBack() {
      this.$emit("goBack");
    },
    markAsCancelled(order) {
      this.cancelledOrders.push(order); // Voeg de bestelling toe aan de geannuleerde lijst
      this.orders = this.orders.filter((o) => o._id !== order._id); // Verwijder de bestelling uit de huidige lijst
    },
    markAsShipped(order) {
      this.shippedOrders.push(order); // Voeg de bestelling toe aan de verzonden lijst
      this.orders = this.orders.filter((o) => o._id !== order._id); // Verwijder de bestelling uit de huidige lijst
    },
  },
  async created() {
    this.isLoggedIn = localStorage.getItem("loggedIn") === "true";

    if (this.isLoggedIn) {
      try {
        const response = await fetch("http://localhost:5000/api/orders");
        this.orders = await response.json();
      } catch (error) {
        console.error("Fout bij het ophalen van bestellingen:", error);
      }
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
