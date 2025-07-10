import { createStore } from 'vuex'
import board from './board'

export default createStore({
  state: () => ({}),
  mutations: {},
  actions: {},
  modules: {
    board,
  },
})
