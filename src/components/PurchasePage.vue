<!-- src/components/PurchasePage.vue -->
<template>
  <div>
    <h1 v-if="movie">Purchase Tickets for {{ movie.name }}</h1>
    <div v-if="loading">Loading movie information...</div>
    <div v-else class="container">
      <div class="movie-details">
        <img :src="movie.poster" alt="Movie poster" />
        <p>Original Name: {{ movie.original_name }}</p>
        <p>Year: {{ movie.year }}</p>
        <p>Genre: {{ movie.genre }}</p>
        <p>IMDb Rating: {{ movie.imdb_rating }}</p>
        <p>Douban Rating: {{ movie.douban_rating }}</p>
        <p>Language: {{ movie.language }}</p>
        <p>Country: {{ movie.country }}</p>
        <p>Description: {{ movie.description }}</p>
      </div>

      <div class="seats-section">
        <div>
          <label for="schedule_date">日期:</label>
          <select id="schedule_date" v-model="selectedSchedule">
            <option
                v-for="schedule in movieSchedules"
                :key="schedule.id"
                :value="schedule"
            >
              {{ schedule.schedule_date }}
            </option>
          </select>
        </div>

        <div>
          <label for="schedule">时间:</label>
          <select id="schedule" v-model="selectedSchedule">
            <option
                v-for="schedule in movieSchedules"
                :key="schedule.id"
                :value="schedule"
            >
              {{ schedule.schedule_time }}
            </option>
          </select>
        </div>
        <div>
          <label for="city">City:</label>
          <select id="city" v-model="selectedCity" @change="fetchMovieSchedules">
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>

        <div>
          <label for="cinema">Cinema:</label>
          <select id="cinema" v-model="selectedCinema" @change="fetchMovieSchedules">
            <option v-for="cinema in cinemas" :key="cinema" :value="cinema">
              {{ cinema }}
            </option>
          </select>
        </div>
          <div class="seats-layout" v-if="selectedSchedule">
          <div class="screen">银幕</div>
          <div
              v-for="(row, rowIndex) in selectedSchedule.seats"
              :key="rowIndex"
              class="row"
          >
            <div
                v-for="(seat, seatIndex) in row"
                :key="seatIndex"
                :class="['seat', seat === 1 ? 'occupied' : '']"
            >
              {{ rowIndex + 1 }}{{ String.fromCharCode(seatIndex + 65) }}
            </div>
          </div>
        </div>
        <div>
          <label for="seatNumber">Seat Number:</label>
          <input type="number" id="seatNumber" v-model="seatNumber" />
        </div>
        <button @click="purchaseTickets">Purchase Tickets</button>
      </div>
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
    const movieSchedules = ref([]); // 添加 movieSchedules 变量
    const loading = ref(true);
    const selectedSchedule = ref(null);
    const seatNumber = ref(1);

    const fetchMovie = async () => {
      const id = parseInt(route.params.movieId);
      console.log(id);
      movie.value = await $api.getMovieById(id);
      movieSchedules.value = await $api.getMovieSchedule(
          id
      ); // 获取电影场次

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
      movieSchedules,
      loading,
      selectedSchedule,
      seatNumber,
      purchaseTickets,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
}

.movie-details {
  flex: 1;
  margin-right: 2rem;
}

.movie-details img {
  width: 100%;
  height: auto;
  object-fit: cover;
  margin-bottom: 1rem;
}

.seats-section {
  flex: 1;
}

.seats-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.screen {
  width: 100%;
  height: 30px;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.row {
  display: flex;
  margin-bottom: 5px;
}

.seat {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  background-color: #fff;
}

.seat.occupied {
  background-color: #f00;
}
</style>
