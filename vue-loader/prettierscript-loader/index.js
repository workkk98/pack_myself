// const loaderUtils = require('loader-utils')
// const hljs = require('highlight.js')
// hljs.registerLanguage('html', require('highlight.js/lib/languages/javascript'));

module.exports = function (source) {  

  //console.log(options)
  console.log("source: ", source);
  
  console.log("source: ", highlight(source));
  return highlight(source)+ "module.exports=code";
}

var pattern = /\/\/ *[a-z|A-Z]*/g;
function highlight (source) {
  return source.replace(pattern, "")
}