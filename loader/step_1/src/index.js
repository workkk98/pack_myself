const code = require('./example.md');
import './atom-one-dark.css';

var pattern = /<script>(.*)<\/script>/;
function writeMd(code) {

  var matchArr = code.match(pattern);
  var scriptStr = matchArr[1];
  var fun = new Function(scriptStr)

  fun()

  const div = document.createElement('div');
  div.innerHTML = code
  document.body.appendChild(div)
}

writeMd(code)

window.addEventListener('load', function () {
  console.log('onload');
})