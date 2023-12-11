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
          <select
              id="schedule_date"
              v-model="selectedDate"
              @change="updateAvailableCinemas"
          >
            <option
                v-for="date in uniqueScheduleDates"
                :key="date"
                :value="date"
            >
              {{ date }}
            </option>
          </select>
        </div>

        <div>
          <label for="city">City:</label>
          <select id="city" v-model="selectedCity" @change="updateAvailableCinemas">
            <option
                v-for="city in uniqueCities"
                :key="city"
                :value="city"
            >
              {{ city }}
            </option>
          </select>
        </div>

        <div>
          <label for="cinema">Cinema:</label>
          <select
              id="cinema"
              v-model="selectedCinema"
              @change="updateAvailableTimes"
          >
            <option v-for="cinema in uniqueCinemas" :key="cinema" :value="cinema">
              {{ cinema }}
            </option>
          </select>
        </div>

        <div>
          <label for="schedule">时间:</label>
          <select id="schedule" v-model="selectedSchedule">
            <option
                v-for="time in availableTimes"
                :key="time"
                :value="time"
            >
              {{ time }}
            </option>
          </select>
        </div>
        <!-- ... -->
        <button
            v-if="selectedDate && selectedCity && selectedCinema && selectedSchedule"
            @click="fetchMovieSeats"
        >
          确认选择
        </button>

      </div>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from "vue-router";
import { inject } from "vue";
import { ref, onMounted, computed } from "vue";

export default {
  props: ["movieId"],
  setup() {
    const $api = inject("$api");
    const router = useRouter();
    const route = useRoute();

    const movie = ref(null);
    const movieSchedules = ref([]);
    const loading = ref(true);
    const selectedDate = ref(null);
    const selectedCity = ref(null);
    const selectedCinema = ref(null);
    const selectedSchedule = ref(null);
    const seatNumber = ref(1);

    const fetchMovie = async () => {
      const id = parseInt(route.params.movieId);
      movie.value = await $api.getMovieById(id);
      movieSchedules.value = await $api.getMovieSchedule(id);

      loading.value = false;
    };

    onMounted(() => {
      fetchMovie();
    });

    const purchaseTickets = async () => {
      router.push({ name: "home" });
    };

    const uniqueScheduleDates = computed(() => {
      const dates = new Set();
      movieSchedules.value.forEach(schedule =>
          dates.add(schedule.schedule_date)
      );
      return Array.from(dates);
    });

    const uniqueCities = computed(() => {
      const cities = new Set();
      movieSchedules.value.forEach(schedule => cities.add(schedule.city));
      return Array.from(cities);
    });

    const uniqueCinemas = computed(() => {
      if (!selectedCity.value || !selectedDate.value) return [];
      return Array.from(
          new Set(
              movieSchedules.value
                  .filter(
                      schedule =>
                          schedule.city === selectedCity.value &&
                          schedule.schedule_date === selectedDate.value
                  )
                  .map(schedule => schedule.cinema_name)
          )
      );
    });

    const availableTimes = computed(() => {
      if (!selectedDate.value || !selectedCity.value || !selectedCinema.value)
        return [];
      return movieSchedules.value
          .filter(
              schedule =>
                  schedule.schedule_date === selectedDate.value &&
                  schedule.city === selectedCity.value &&
                  schedule.cinema_name === selectedCinema.value
          )
          .map(schedule => schedule.schedule_time);
    });

    const updateAvailableCinemas = () => {
      selectedCinema.value = uniqueCinemas.value[0];
      updateAvailableTimes();
    };
    const fetchMovieSeats = async () => {
      const selectedId = movieSchedules.value.find(
          (schedule) =>
              schedule.schedule_date === selectedDate.value &&
              schedule.city === selectedCity.value &&
              schedule.cinema_name === selectedCinema.value &&
              schedule.schedule_time === selectedSchedule.value
      ).id;
      const seats = await $api.getMovieSeats(selectedId);
      console.log(seats);
    };

    const updateAvailableTimes = () => {
      selectedSchedule.value = movieSchedules.value.find(
          schedule =>
              schedule.schedule_date === selectedDate.value &&
              schedule.city === selectedCity.value &&
              schedule.cinema_name === selectedCinema.value
      );
    };

    return {
      movie,
      movieSchedules,
      loading,
      selectedDate,
      selectedCity,
      selectedCinema,
      selectedSchedule,
      seatNumber,
      purchaseTickets,
      uniqueScheduleDates,
      uniqueCities,
      uniqueCinemas,
      availableTimes,
      updateAvailableCinemas,
      updateAvailableTimes,
      fetchMovieSeats,
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
