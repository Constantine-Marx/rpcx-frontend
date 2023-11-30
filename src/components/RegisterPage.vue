<!-- src/components/Register.vue -->
<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="Username" v-model="username"/>
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="Email" v-model="email"/>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="Password" v-model="password"/>
      </div>
      <div>
        <label for="confirm-password">Confirm Password:</label>
        <input type="password" id="confirm-password" v-model="confirmPassword"/>
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      Username: "",
      email: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
    };
  },
  methods: {
    async register() {
      this.errorMessage = "";

      // 验证表单数据
      if (this.username.trim() === "") {
        this.errorMessage = "Username is required.";
        return;
      }
      if (this.email.trim() === "") {
        this.errorMessage = "Email is required.";
        return;
      }
      if (this.password.trim() === "") {
        this.errorMessage = "Password is required.";
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return;
      }

      // 构建请求数据
      const requestData = {
        Username: this.username,
        Email: this.email,
        Password: this.password,
      };

      try {
        // 调用注册 API
        // 这里需要替换为您的实际 API 调用
        const response = await fetch("http://localhost:9981/UserService", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RPCX-Version":"1.8.21",
            "X-RPCX-MessageType":"0",
            "X-RPCX-SerializeType":"1",
            "X-RPCX-ServicePath":"UserService",
            "X-RPCX-ServiceMethod":"CreateUser"
          },
          body: JSON.stringify(requestData),
        });

        // 检查 API 响应状态
        if (!response.ok) {
          this.errorMessage = "Registration failed.";
          return;
        }

        // 如果成功，跳转到登录页
        this.$router.push("/login");
      } catch (error) {
        this.errorMessage = "An error occurred while registering.";
      }
    },
  },
};
</script>
