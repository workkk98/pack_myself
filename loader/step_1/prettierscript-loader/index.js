const loaderUtils = require('loader-utils')
// const hljs = require('highlight.js')
// hljs.registerLanguage('html', require('highlight.js/lib/languages/javascript'));

module.exports = function (source) {  
  // 起步
  const options = loaderUtils.getOptions(this) // this指向webpack
  
  console.log(options)
  console.log("source: ", source);
  
  console.log("source: ", highlight(source));
  return highlight(source);
}

var script = "<script>document.addEventListener(\'DOMContentLoaded\', (event) => {\
  console.log('触发');\
  document.querySelectorAll(\'pre code\').forEach((block) => {\
    console.log(block);\
  });\
}); </script>";

var pattern = /\/\/ *hljs/g;
function highlight (source) {
  return source.replace(pattern, script)
}