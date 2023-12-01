<!-- src/components/LoginPage.vue -->
<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>
<script>
// 导入 mapMutations 辅助函数
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    // 将 Vuex 中的 setLoggedIn 和 setUser 映射到组件方法
    ...mapMutations(["setLoggedIn", "setUser"]),
    async login() {
      // 调用登录 API，获取用户信息
      // 注意：您需要根据实际情况替换此 API 调用
      const response = await fetch("http://localhost:9981/UserService", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RPCX-Version": "1.8.21",
          "X-RPCX-MessageType": "0",
          "X-RPCX-SerializeType": "1",
          "X-RPCX-ServicePath": "UserService",
          "X-RPCX-ServiceMethod": "Login",
        },
        body: JSON.stringify({ Username: this.username, Password: this.password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        // 更新全局状态
        this.setLoggedIn(true);
        this.setUser(responseData);

        // 跳转到主页
        this.$router.push({ name: "home" });
      } else {
        // 处理登录失败的情况
        console.error("Login failed.");
      }
    },
  },
};
</script>
