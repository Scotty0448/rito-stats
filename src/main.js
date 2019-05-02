import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import Tooltip from 'vue-directive-tooltip'
import 'vue-directive-tooltip/css/index.css'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(new VueSocketIO({connection:'https://stats-server.ritotools.net'}))
Vue.use(Tooltip)

new Vue({
  render: h => h(App),
}).$mount('#app')
