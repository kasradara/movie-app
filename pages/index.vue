<template>
  <div>
    <div v-if="!$fetchState.pending">
      <form @submit.prevent="searchDate()">
        <div class="header justify-between">
          <div class="search-box">
            <div>
              <span>release start:</span>
              <input class="search-input" type="date" v-model="startDate" required>
            </div>
            <div>
              <span>release end:</span>
              <input class="search-input" type="date" v-model="endDate" required>
            </div>
          </div>
          <button class="btn">search</button>
        </div>
      </form>
      <div class="movie-list" v-if="movies.length">
        <div v-for="movie in movies" :key="movie.id">
          <nuxt-link class="movie-box" :to="{ name: 'movie-id', params: { id: movie.id } }">
            <div class="poster">
              <img :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`" alt="">
            </div>
            <div class="detail content-between">
              <h2 class="title">{{ movie.title }}</h2>
              <div class="caption">
                <span>{{ movie.release_date }}</span>
                <div>
                  <span v-for="(genre, index) in movie.genre_ids" :key="index">
                    {{ getGenre(genre) }} {{ movie.genre_ids.length !== index + 1 ? '|' : '' }}
                  </span>
                </div>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div class="pagination">
        <span @click="changePage('last')" class="paginator" v-if="this.page != 1">last page </span>
        <span v-if="this.page != 1"> | </span>
        <span @click="changePage('next')" class="paginator">next page </span>
        <p class="text-xs">Showing results {{ 1 + ((page - 1) * 20) }}-{{ page * 20 }}</p>
      </div>
    </div>


  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      movies: [],
      genres: [],
      startDate: '',
      endDate: '',
      page: 1
    }
  },
  created() {
    this.$store.dispatch('fetchReq', { path: 'genres' })
      .then(res => {
        this.genres = res.genres
      })
    this.page = this.$route.query.page ? this.$route.query.page : 1
    this.startDate = this.$route.query.startDate ? this.$route.query.startDate : ''
    this.endDate = this.$route.query.endDate ? this.$route.query.endDate : ''
  },
  async fetch() {
    await this.$store.dispatch('fetchReq', {
      path: 'list',
      variables: `&page=${this.page}&primary_release_date.lte=${this.endDate}&primary_release_date.gte=${this.startDate}`
    }).then(resp => {
      this.movies = resp.results
    })
  },
  methods: {
    changePage(type) {
      let query = this.$route.query
      delete query.page
      type == 'next' ? this.page++ : this.page--;
      this.$router.push({ query: { page: this.page, ...this.$route.query } })
    },
    getGenre(value) {
      if (this.genres.length) {
        return this.genres.find(genre => {
          return genre.id == value
        }).name
      } return value
    },
    searchDate() {
      this.page = 1
      this.$router.push({ query: { startDate: this.startDate, endDate: this.endDate } })
    }

  },
  watch: {
    $route(to, from) {
      this.$fetch()
    },
  },


}
</script>
