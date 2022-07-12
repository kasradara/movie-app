export const state = () => ({
  apiPaths: {
    genres: 'genre/movie/list',
    list: 'discover/movie',
  }
})

export const actions = {
  fetchReq( { state }, {path, variables = ''}) {
    return fetch(`/3/${state.apiPaths[path]}?api_key=f62f750b70a8ef11dad44670cfb6aa57${variables}`, {
      method: "GET",
    })
    .then(res => res.json())
  },
  fetchReqWParams( { state }, {path, variables = ''}) {
    return fetch(`/3/${path}?api_key=f62f750b70a8ef11dad44670cfb6aa57${variables}`, {
      method: "GET",
    })
    .then(res => res.json())
  },

}
