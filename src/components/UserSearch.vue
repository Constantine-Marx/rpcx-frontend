<template>
  <div>
    <h1>Search User</h1>
    <input v-model="userID" placeholder="Enter user ID"/>
    <button @click="searchUser">Search</button>
    <div v-if="user">
      <h2>User Information</h2>
      <p>ID: {{ user.ID }}</p>
      <p>Name: {{ user.Username }}</p>
      <p>Email: {{ user.Email }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userID: null,
      user: null,
    };
  },
  methods: {
    async searchUser() {
      try {
        const response = await axios.post(
            "http://localhost:9981/UserService",
            {
              "ID": parseInt(this.userID)
            },
            {
              headers: {
                "Content-Type": "application/json",
                "X-RPCX-Version":"1.8.21",
                "X-RPCX-MessageType":"0",
                "X-RPCX-SerializeType":"1",
                "X-RPCX-ServicePath":"UserService",
                "X-RPCX-ServiceMethod":"GetUserByID"
              },
            }
        );
        this.user = {
          ID: response.data.ID,
          Username: response.data.Username,
          Email: response.data.Email
        };

        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

