import Vue from 'vue';
import HelloWorld from './src/index.vue';

new Vue({
  el: '#app',
  components: {
    HelloWorld
  },
  render (h) {
    return h('hello-world');
  }
})