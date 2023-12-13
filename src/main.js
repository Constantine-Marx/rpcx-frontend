// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import * as api from "./api/movie"; // 确保您已正确导入 api/movie.js 文件
import store from "./store";

const app = createApp(App);

app.provide("$api", api); // 提供 $api 对象
app.provide("store", store); // 提供 store 对象
app.use(router);
app.mount("#app");
