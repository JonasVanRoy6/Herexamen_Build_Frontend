<template>
  <div>
    <h1>Verzonden Bestellingen</h1>
    <button @click="$emit('goBack')">Terug</button>
    <p>Hier komen de verzonden bestellingen.</p>
    <ul>
      <li v-for="order in shippedOrders" :key="order._id">
        <p><strong>Bestelling ID:</strong> {{ order._id }}</p>
        <p><strong>Smaak:</strong></p>
        <ul>
          <li v-for="flavor in order.flavors" :key="flavor._id">
            - {{ flavor.name }}
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
  props: ["shippedOrders"],
};
</script>

<style scoped>
button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
