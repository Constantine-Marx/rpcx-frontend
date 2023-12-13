<!--src/components/PurchasePage.vue-->
<template>
  <div>
    <h1 v-if="movie">Purchase Tickets for {{ movie.name }}</h1>
    <div v-if="loading">Loading movie information...</div>
    <div v-else class="container">
      <div class="movie-details">
        <div class="card">
          <img :src="movie.poster" alt="Movie poster"/>
        </div>
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

        <button
            v-if="selectedDate && selectedCity && selectedCinema && selectedSchedule"
            @click="fetchMovieSeats"
        >
          确认选择
        </button>

        <div class="seats-layout" v-if="seats && seats.length">

          <div class="screen">屏幕</div>
          <div class="row" v-for="(row, rowIndex) in seats" :key="rowIndex">
            <div
                class="seat"
                :class="{ occupied: seat === 1, selected: isSelectedSeat(rowIndex, seatIndex) }"
                v-for="(seat, seatIndex) in row"
                :key="seatIndex"
                @click="toggleSeatSelection(rowIndex, seatIndex)"
            >
              {{ `${indexToLetter(rowIndex)}${seatIndex + 1}` }}
            </div>
          </div>
        </div>

        <button
            v-if="selectedDate && selectedCity && selectedCinema && selectedSchedule"
            @click="purchaseTickets"
        >
          确认购买
        </button>

      </div>

    </div>
  </div>
</template>

<script>
import {useRouter, useRoute} from "vue-router";
import {inject} from "vue";
import {ref, onMounted, computed} from "vue";
import {createOrder} from "@/api/movie";

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
    const seats = ref([]);
    const selectedSeats = ref([]);
    const orderStatus = ref(null);




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
      const user_id = localStorage.getItem("user_id");
      const movie_id = parseInt(route.params.movieId);
      const schedule_id = movieSchedules.value.find(
          (schedule) =>
              schedule.schedule_date === selectedDate.value &&
              schedule.city === selectedCity.value &&
              schedule.cinema_name === selectedCinema.value &&
              schedule.schedule_time === selectedSchedule.value
      ).id;
      const seat_number = selectedSeats.value.length;
      const price = 50 * seat_number;
      const seatCoordinates = selectedSeats.value.map(seat => seatToCoordinates(seat));

      const seat_row = seatCoordinates.map(coord => coord[0]);
      const seat_column = seatCoordinates.map(coord => coord[1]);
      const data = {
        user_id,
        movie_id,
        schedule_id,
        seat_number,
        seat_row: seat_row[0],
        seat_column: seat_column[0],
        price,
      };
      // 调用 createOrder API 并传递订单数据
      const response = await createOrder(data);
      orderStatus.value = response.status;

      const orderNumber = response.data?.OrderNumber;

      if (orderStatus.value === 200) {
        alert(`购票成功，订单号：${orderNumber}`);
        await router.push("/home");
      } else {
        alert("购票失败");
      }
    };


    const uniqueScheduleDates = computed(() => {
      const dates = new Set();
      movieSchedules.value.forEach(schedule =>
          dates.add(schedule.schedule_date)
      );
      return Array.from(dates);
    });

    const indexToLetter = (index) => {
      return String.fromCharCode(65 + index);
    };


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
      seats.value = await $api.getMovieSeats(selectedId);
      console.log("Seats data:", seats.value);
    };

    const updateAvailableTimes = () => {
      selectedSchedule.value = movieSchedules.value.find(
          schedule =>
              schedule.schedule_date === selectedDate.value &&
              schedule.city === selectedCity.value &&
              schedule.cinema_name === selectedCinema.value
      );
    };

    const toggleSeatSelection = (rowIndex, seatIndex) => {
      // 如果座位已被占用（红色方框），则不执行任何操作
      if (seats.value[rowIndex][seatIndex] === 1) {
        return;
      }

      const seatCoordinates = `${rowIndex}-${seatIndex}`;

      if (selectedSeats.value.includes(seatCoordinates)) {
        selectedSeats.value = selectedSeats.value.filter(
            (seat) => seat !== seatCoordinates
        );
      } else {
        selectedSeats.value.push(seatCoordinates);
      }
    };


    const isSelectedSeat = (rowIndex, seatIndex) => {
      const seatCoordinates = `${rowIndex}-${seatIndex}`;
      return selectedSeats.value.includes(seatCoordinates);
    };

    function seatToCoordinates(seat) {
      const [row, column] = seat.split("-");
      return [parseInt(row), parseInt(column)];
    }


    return {
      movie,
      movieSchedules,
      loading,
      selectedDate,
      selectedCity,
      selectedCinema,
      selectedSchedule,
      seatNumber,
      uniqueScheduleDates,
      uniqueCities,
      uniqueCinemas,
      availableTimes,
      seats,
      selectedSeats,
      orderStatus,
      purchaseTickets,
      updateAvailableCinemas,
      indexToLetter,
      updateAvailableTimes,
      fetchMovieSeats,
      isSelectedSeat,
      toggleSeatSelection,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
}

.card {
  flex: 1;
  margin-right: 2rem;
  max-width: 200px; /* 您可以根据需要调整此值 */
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

.seat.selected {
  background-color: #0f0;
}


</style>
