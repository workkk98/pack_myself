// define plugin

if (BROWSER_SUPPORTS_HTML5) {
  console.log(BROWSER_SUPPORTS_HTML5);
}

if (TARGET === 'development') {
  const foo = require('./foo');
  // console.log(foo());
}

console.log(VERSION);
console.log(TWO);

// 定义一个对象全局变量
if (process.env) {
  console.log(process.env.NODE_ENV);
}

// 访问一个对象中的某个属性
if (process.env.NODE_ENV === 'development') {
  console.log(process.env.NODE_ENV);
}

if (typeof mobile === 'mobile') {
  console.log('typeof mobile');
}