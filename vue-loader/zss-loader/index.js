const loaderUtils = require('loader-utils')

module.exports = code => code


module.exports.pitch = function(remainingRequest) {
  const loaders = [
    // '../nodule_modules/style-loader/dist/cjs.js',
    // '../node_modules/css-loader/dist/cjs.js',
    'style-loader',
    'css-loader'
  ]

  const request =  loaderUtils.stringifyRequest(
    this,
    '-!' + [
      ...loaders,
      this.resourcePath
    ].join('!')
  )

  console.log('zss-loader', request)
  return `import ${request};`
}