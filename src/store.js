import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
/* eslint-disable */

/************
*   STATE   *
************/
const state = {
  user: 'game_master',
  authBracket: null,
  playedBracket: null
}

/****************
*   MUTATIONS   *
****************/
const mutations = {
  setUser: (state, user) => {
    Vue.set(state, 'user', user)
  },
  setAuthBracket: (state, bracket) => {
    Vue.set(state, 'authBracket', bracket)
  },
  setPlayedBracket: (state, bracket) => {
    Vue.set(state, 'playedBracket', bracket)
  }
}

const store = {
  state,
  mutations
}

export default new Vuex.Store(store)
