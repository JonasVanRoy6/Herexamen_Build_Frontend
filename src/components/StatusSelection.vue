<template>
  <div>
    <h1>Kies een status</h1>
    <button @click="$emit('navigateToOrders')">Te verwerken</button>
    <button @click="$emit('navigateToCancelledOrders')">Geannuleerd</button>
    <button @click="$emit('navigateToShippedOrders')">Verzonden</button>
  </div>
</template>

<script>
export default {};
</script>
