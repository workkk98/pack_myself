import Vue from 'vue'
import App from './app.vue'

console.log('app')

new Vue({
  el: '#app',
  render: (h) => h(App)
})