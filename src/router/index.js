// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/HomePage.vue";
import UserSearch from "@/components/UserSearch.vue";
import Login from "@/components/LoginPage.vue";
import Register from "@/components/RegisterPage.vue";

const routes = [
    {
        path: "/",
        redirect: "/home",
    },
    {
        path: "/home",
        name: "home",
        component: HomePage,
    },
    {
        path: "/user-search",
        name: "UserSearch",
        component: UserSearch,
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
