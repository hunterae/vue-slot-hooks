import Vue from 'vue'
import App from './App.vue'

import RenderWithSlotHooks from '../src/plugin'
Vue.use(RenderWithSlotHooks)

new Vue({
  render: h => h(App)
}).$mount('#app')
