<!-- src/components/PurchasePage.vue -->
<template>
  <div>
    <h1 v-if="movie">Purchase Tickets for {{ movie.name }}</h1>
    <div v-if="loading">Loading movie information...</div>
    <div v-else>
      <div>
        <label for="schedule">Schedule:</label>
        <select id="schedule" v-model="selectedSchedule">
          <option v-for="schedule in movie.schedules" :key="schedule.id" :value="schedule.id">
            {{ schedule.time }}
          </option>
        </select>
      </div>
      <div>
        <label for="seatNumber">Seat Number:</label>
        <input type="number" id="seatNumber" v-model="seatNumber" />
      </div>
      <button @click="purchaseTickets">Purchase Tickets</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { inject } from "vue";

export default {
  props: ["movieId"],
  setup() {
    const $api = inject("$api");
    const router = useRouter();
    const route = useRoute();

    const movie = ref(null);
    const loading = ref(true);
    const selectedSchedule = ref(null);
    const seatNumber = ref(1);

    const fetchMovie = async () => {
      const id = parseInt(route.params.movieId)
      console.log(id)
      movie.value = await $api.getMovieById(id);
      loading.value = false;
    };

    onMounted(() => {
      fetchMovie();
    });

    const purchaseTickets = async () => {
      // Call your API to create an order here
      // Use `selectedSchedule.value` and `seatNumber.value` to create the order
      // After successfully creating the order, navigate back to the home page or another appropriate page
      router.push({ name: "home" });
    };

    return {
      movie,
      loading,
      selectedSchedule,
      seatNumber,
      purchaseTickets,
    };
  },
};
</script>
