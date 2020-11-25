const regularExpression = /\/\/\s*([\w\s';\.\/(\\n)]+)/;
module.exports = function (source) {
  let str = source.match(regularExpression) && source.match(regularExpression)[1];

  console.log(str);
  if (!str) {
    return source;
  }
  return `${str}`;
}