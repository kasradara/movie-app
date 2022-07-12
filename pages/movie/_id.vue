<template>
    <div class="movie-detail">
        <div v-if="!$fetchState.pending">
            <div class="header">
                <nuxt-link to="/">
                    <button class="btn">back</button>
                </nuxt-link>
                <div class="detail">
                    <h2 class="title">{{ detail.title }}</h2>
                    <span>{{ detail.tagline }}</span>
                </div>
            </div>
            <div class="about">
                <img class="poster" :src="`https://image.tmdb.org/t/p/w500/${detail.poster_path}`">
                <div class="data">
                    <div class="data-row mt-4">
                        <h3 class="title">Budget</h3>
                        <span>{{ detail.budget | toUSD }}</span>
                    </div>
                    <div class="data-row">
                        <h3 class="title">Revenue</h3>
                        <span>{{ detail.revenue | toUSD }}</span>
                    </div>
                    <div class="data-row">
                        <h3 class="title">Release data</h3>
                        <span>{{ detail.release_date }}</span>
                    </div>
                    <div class="data-row">
                        <h3 class="title">Runtime</h3>
                        <span>{{ detail.runtime | toHour }}</span>
                    </div>
                    <div class="data-row">
                        <h3 class="title">Score</h3>
                        <span>{{ detail.vote_average }} ({{ detail.vote_count }} votes)</span>
                    </div>
                    <div class="data-row">
                        <h3 class="title">Genres</h3>
                        <div>
                            <span v-for="genre in detail.genres" :key="genre.id">{{ genre.name }}, </span>
                        </div>
                    </div>
                    <div class="data-row">
                        <h3 class="title">IMDB link</h3>
                        <a class="link" :href="`https://www.imdb.com/title/${detail.imdb_id}/`">link</a>
                    </div>
                    <div class="data-row">
                        <h3 class="title">Homepage Link</h3>
                        <a class="link" :href="detail.homepage">link</a>
                    </div>
                </div>
            </div>
            <p class="mt-12 mb-20">{{ detail.overview }}</p>
            <div class="credit">
                <h2 class="font-bold">Credit</h2>
                <span v-for="(actor, index) in movieCast" :key="index">{{ actor }}, </span>
                <span v-if="cast.length > 10 && moreCast == false" class="cursor-pointer font-semibold"
                    @click="moreCast = true"> and {{ cast.length - 10 }} more</span>
            </div>

        </div>
    </div>
</template>
<script>
export default {
    name: 'detail',
    data() {
        return {
            param: this.$route.params.id,
            detail: {},
            cast: [],
            moreCast: false
        }
    },
    async fetch() {
        await this.$store.dispatch('fetchReqWParams', {
            path: `movie/${this.param}`
        }).then(res => {
            this.detail = res
            this.$store.dispatch('fetchReqWParams', {
                path: `movie/${this.param}/credits`
            }).then(response => this.cast = response.cast)
        })
    },
    computed: {
        movieCast() {
            let cast = []
            this.cast.forEach(item => {
                cast.push(item.name)
            })
            if (!this.moreCast) {
                cast = cast.slice(0, 10)
            }
            return cast
        }
    },
    filters: {
        toUSD(value) {
            return `$${value.toLocaleString()}`
        },
        toHour(value) {
            let hour = Math.floor(value / 60)
            let minute = value % 60
            hour ? hour = hour + 'hr' : hour = ''
            minute ? minute = minute + 'min' : minute = ''
            return hour + " " + minute
        }
    }

}
</script>