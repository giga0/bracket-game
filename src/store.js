import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const gatherValues = (values, item) => {
  if (!item.value) return
  values.push(item.value.value)
  if (item.children.length) {
    for (let child of item.children) {
      gatherValues(values, child)
    }
  }
}

/************
*   STATE   *
************/
const state = {
  user: 'game_master',
  authBracket: null,
  playedBracket: null
}

/**************
*   GETTERS   *
**************/
const getters = {
  getAuthBracketValues: state => {
    const values = []
    gatherValues(values, state.authBracket)
    return values
  },
  getPlayedBracketValues: state => {
    const values = []
    gatherValues(values, state.playedBracket)
    return values
  }
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
  getters,
  mutations
}

export default new Vuex.Store(store)
