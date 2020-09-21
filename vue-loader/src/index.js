import Vue from 'vue';
import ComApp from './app.vue';
console.log(ComApp)

function createContainer () {
  let div = document.createElement('div');
  div.setAttribute('id', 'app')
  return div;
}
document.body.append(createContainer())

new Vue({
  el: '#app',
  components: {
    ComApp
  },
  render (h) {
    return h(ComApp, [
      ComApp.__md
    ])
  }
})