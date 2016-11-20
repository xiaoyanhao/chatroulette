import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import plugins from './plugins'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins
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
