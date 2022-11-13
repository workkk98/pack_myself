import Vue from 'vue';
import ComApp from './app.vue';

function createContainer () {
  let div = document.createElement('div');
  div.setAttribute('id', 'app')
  return div;
}

function createDashboard () {
  let div = document.createElement('div');
  div.setAttribute('id', 'dashboard');
  div.style = 'width: 50%; height: 100%; border-left: 1px solid grey; padding-left: 16px;\
  position: fixed; right: 0; top: 0; padding=left: 16px'
  return div;
}
document.body.append(createContainer(), createDashboard());

new Vue({
  el: '#app',
  components: {
    ComApp
  },
  render (h) {
    document.querySelector('#dashboard').innerHTML = ComApp.__md
    return h(ComApp)
  },
  mounted () {
    if (hljs.highlightBlock) {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
      });
    }
  }
})
