import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: 'dark'
  },
  getters: {
    // 例如，您可以添加一个 getter 来获取当前主题
    currentTheme: state => state.theme
  },
  mutations: {
    changeTheme(state) {
      // 使用赋值操作来改变状态
      state.theme = state.theme === 'dark' ? 'theme1' : 'dark';
    }
  },
  actions: {
    changeTheme({ commit }) {
      commit('changeTheme');
    }
  },
  modules: {}
})