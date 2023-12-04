<!-- src/components/MovieCard.vue -->
<template>
  <div class="movie-card">
    <div class="poster">
      <img :src="movie.poster" alt="Movie poster" />
    </div>
    <div class="info">
      <h3>{{ movie.name }}</h3>
      <p>Original Name: {{ movie.original_name }}</p>
      <p>Year: {{ movie.year }}</p>
      <p>Genre: {{ movie.genre }}</p>
      <p>IMDb Rating: {{ movie.imdb_rating }}</p>
      <p>Douban Rating: {{ movie.douban_rating }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.movie-card {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.poster {
  width: 30%;
  margin-right: 1rem;
}

.poster img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.info {
  width: 70%;
}
</style>
