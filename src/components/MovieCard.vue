<!-- src/components/MovieCard.vue -->
<template>
  <div class="movie-card">
    <div class="poster">
      <img :src="movie.poster" alt="Movie poster" />
    </div>
    <div class="info">
      <h3>{{ movie.name }}</h3>
      <p>原名: {{ movie.original_name }}</p>
      <p>上映日期: {{ movie.year }}</p>
      <p>类型: {{ movie.genre }}</p>
      <p>IMDb评分: {{ movie.imdb_rating }}</p>
      <p>豆瓣评分: {{ movie.douban_rating }}</p>
      <button @click="goToPurchase">Purchase Tickets</button>
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
  methods: {
    goToPurchase() {
      this.$router.push({ name: "purchase", params: { movieId: this.movie.id } });
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
  flex: 1;
  margin-right: 2rem;
  max-width: 200px; /* 您可以根据需要调整此值 */
}

.poster img {
  width: 100%;
  height: auto; /* 修改这里，设置一个固定的高度 */
  object-fit: cover; /* 添加这个属性，使图片保持原始比例并填充容器 */
  border-radius: 4px;
}

.info {
  width: 70%;
}
</style>
