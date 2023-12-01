// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import * as api from "./api/movie";

const app = createApp(App);
app.provide("$api", api);
app.use(router);
app.mount("#app");
