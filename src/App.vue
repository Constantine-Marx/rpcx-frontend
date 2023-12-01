<!-- src/App.vue -->
<template>
  <div id="app">
    <header>
      <h1>Movie Ticket System</h1>
      <div class="user-info">
        <!-- 使用按钮替换路由链接 -->
        <button @click="goTo('home')">Home</button>
        <button @click="goTo('UserSearch')">User Search</button>
        <button @click="goTo('Login')">Login</button>
        <button @click="goTo('Register')">Register</button>
      </div>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["loggedIn", "user"]),
  },
  methods: {
    // 添加一个方法用于导航到目标页面
    goTo(routeName) {
      this.$router.push({ name: routeName });
    },
  },
};
</script>
