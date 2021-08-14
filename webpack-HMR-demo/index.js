// ES6 Module
import hello from './hello.js'

// common.js
var foo = require('./foo');
const div = document.createElement('div')
div.innerHTML = hello()

const div2= document.createElement('div')
div2.innerHTML = foo()

document.body.appendChild(div)
document.body.appendChild(div2)

if (module.hot) {
  module.hot.accept('./hello.js', function () {
    div.innerHTML = hello();
  })

  module.hot.accept('./foo', function () {
    // it's different
    // foo = require('./foo');
    div2.innerHTML = foo();
  })
}
