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
import { ref, inject } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const username = ref("");
    const password = ref("");

    const store = inject("store");
    const router = useRouter();

    const login = async () => {
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
        body: JSON.stringify({ Username: username.value, Password: password.value }),
      });

      if (response.ok) {
        const responseData = await response.json();
        // 更新全局状态
        store.commit("setLoggedIn", true);
        store.commit("setUser", responseData);

        // 跳转到主页
        router.push({ name: "home" });
      } else {
        // 处理登录失败的情况
        console.error("Login failed.");
      }
    };

    return {
      username,
      password,
      login,
    };
  },
};
</script>
