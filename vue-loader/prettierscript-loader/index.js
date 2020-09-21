// const loaderUtils = require('loader-utils')
// const hljs = require('highlight.js')
// hljs.registerLanguage('html', require('highlight.js/lib/languages/javascript'));

module.exports = function (source, map) {  

  //console.log(options)
  console.log("source: ", source);
  
  let md = highlight(source);
  this.callback(null, 
    `
    export default function (Component) {
      Component.options.__md = ${md}
    }
    `,
    map)
}

var pattern = /\".*\";/g;
function highlight (source) {
  return source.match(pattern)[0];
}