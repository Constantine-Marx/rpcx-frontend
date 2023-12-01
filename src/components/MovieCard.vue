<!-- src/components/MovieCard.vue -->
<template>
  <div class="movie-card">
    <h3>{{ movie.Title }}</h3>
    <p>Rating: {{ movie.Rating }}</p>
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
