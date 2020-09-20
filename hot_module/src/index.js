import printMe from './print';
import callMe from './call';

function createButt () {
  var butt = document.createElement('button');
  butt.appendChild(document.createTextNode('print me'));
  butt.addEventListener('click', printMe);

  /**
   * butt.addEventListener('click', () => {
   *    printMe();
   * });
   */
  return butt;
}

document.body.appendChild(createButt())
callMe()

if (module.hot) {
  module.hot.accept('./print.js', function () {
    printMe()
  });
}