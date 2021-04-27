// define plugin

if (BROWSER_SUPPORTS_HTML5) {
  console.log(BROWSER_SUPPORTS_HTML5);
}

if (TARGET === 'development') {
  const foo = require('./foo');
  console.log(foo());
}

console.log(VERSION);
console.log(TWO);