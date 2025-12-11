import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Home from "../pages/Home.vue";
import Register from "../pages/Register.vue";
import SearchResults from "../pages/SearchResults.vue";

const routes = [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/register", component: Register },
    { path: "/search", component: SearchResults }
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});