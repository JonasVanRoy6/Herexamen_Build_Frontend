import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Orders from "../components/Orders.vue";

const routes = [
  {
    path: "/",
    redirect: "/login", // Standaard naar de loginpagina
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/orders",
    name: "Orders",
    component: Orders,
    beforeEnter: (to, from, next) => {
      // Controleer of de gebruiker is ingelogd
      const loggedIn = localStorage.getItem("loggedIn");
      if (loggedIn) {
        next();
      } else {
        next("/login"); // Stuur de gebruiker terug naar de loginpagina
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;