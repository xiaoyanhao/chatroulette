import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import createLogger from 'vuex/dist/logger'
import {createWebSocket} from './plugins'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: process.env.NODE_ENV !== 'production'
    ? [createLogger(), createWebSocket(state.socket)]
    : [createWebSocket(state.socket)]
})

if (module.hot) {
  module.hot.accept([
    './state',
    './getters',
    './mutations',
    './actions'
  ], () => {
    store.hotUpdate({
      state: require('./state').default,
      getters: require('./getters').default,
      mutations: require('./mutations').default,
      actions: require('./actions').default
    })
  })
}

export default store
