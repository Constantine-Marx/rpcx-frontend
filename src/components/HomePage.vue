<!-- src/components/HomePage.vue -->
<template>
  <div>
    <h2>Movies</h2>
    <div class="movies-list" >
      <movie-card v-for="movie in movies" :key="movie.id" :movie="movie"/>
    </div>
    <!-- 添加滚动事件监听 -->
    <div v-show="isLoading">Loading...</div>
  </div>
</template>

<script>
import MovieCard from "./MovieCard.vue";
import {ref, onMounted, onBeforeUnmount} from "vue";
import {inject} from "vue";

export default {
  components: {
    MovieCard,
  },
  setup() {
    const $api = inject("$api");
    const movies = ref([]);
    const isLoading = ref(false);
    const pageNum = ref(1);
    const hasMore = ref(true);

    const fetchMovies = async () => {
      if (!hasMore.value) {
        return;
      }
      isLoading.value = true;
      const newMovies = await $api.getMovies(pageNum.value);

      if (newMovies.length === 0) {
        hasMore.value = false;
      } else {
        movies.value = movies.value.concat(newMovies);
        pageNum.value++;
      }
      isLoading.value = false;
    };

    const handleScroll = () => {
      const scrollTop =
          document.documentElement.scrollTop
          || document.body.scrollTop;
      const windowHeight = document.documentElement.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      if (scrollHeight - scrollTop - windowHeight < 50) {
        fetchMovies();
      }
    };

    onMounted(() => {
      fetchMovies();
      window.addEventListener("scroll", handleScroll);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    return {
      movies,
      isLoading,
    };
  },
};
</script>

<style>
.movies-list {
  max-width: 60%;
}
</style>