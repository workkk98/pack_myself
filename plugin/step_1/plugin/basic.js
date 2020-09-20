class BasicPlugin {
  constructor (options) {
  }

  // webpack 会调用BasicPlugin实例的apply方法，并传入compiler对象
  apply(compiler) {
    compiler.plugin('compilation', function (compilation) {
      console.log('hello: BasicPlugin');
      // console.log(compiler.hooks)
    })
  }
}

module.exports = BasicPlugin;