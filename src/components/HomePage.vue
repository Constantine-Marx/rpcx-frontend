<template>
  <div id="app">
    <header>
      <h1>Movie Ticket System</h1>
      <div class="user-info">
        <template v-if="loggedIn">
          <img :src="user.avatar" alt="User Avatar" class="user-avatar"/>
          <span class="user-name">{{ user.name }}</span>
          <nav>
            <ul>
              <li>
                <router-link to="/buy-tickets">Buy Tickets</router-link>
              </li>
              <li>
                <router-link to="/purchase-history">Purchase History</router-link>
              </li>
            </ul>
          </nav>
        </template>
        <template v-else>
          <button @click="goToLogin">Login</button>
          <button @click="goToRegister">Register</button>
          <button @click="goToUserSearch">Search User</button>
        </template>
      </div>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loggedIn: false,
      user: {
        name: "",
        avatar: "",
      },
    };
  },
  methods: {
    goToLogin() {
      this.$router.push("/login");
    },
    goToRegister() {
      this.$router.push("/register");
    },
    goToUserSearch() {
      this.$router.push("/user-search");
    },
  },
};
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.5rem;
}

.user-name {
  margin-right: 1rem;
}

nav ul {
  list-style: none;
  padding: 0;
  display: flex;
}

nav li {
  margin-right: 1rem;
}

nav a {
  text-decoration: none;
  color: #333;
}

nav a:hover {
  text-decoration: underline;
}

button {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 0 0.25rem;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}
</style>
