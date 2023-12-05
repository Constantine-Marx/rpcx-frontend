// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import * as api from "./api/movie"; // 确保您已正确导入 api/movie.js 文件

const app = createApp(App);

app.provide("$api", api); // 将 $api 对象提供给应用程序
app.use(router);
app.mount("#app");
