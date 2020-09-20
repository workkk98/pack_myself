# plugin

loader是一个函数, 而plugin则是个构造函数。
```js
module.exports = {
  plugins: [
    new example()
  ]
}
```

从这里我们也能看到webpack使用plugin创建的实例。

在我的理解，因为plugin是一个监听webpack广播事件的插件，所以它最好是永远在内存里的一个变量，随时可以触发一个回调函数。

[编写一个插件](https://www.webpackjs.com/contribute/writing-a-plugin/#compiler-%E5%92%8C-compilation)

### 工作原理

在初始化compiler对象后，调用各个plugin实例的apply函数，并传入compiler对象。插件实例在获取compiler对象后，可以像注册dom事件一样，通过```compiler.plugin(event, callback)```注册回调函数。在不同的事件阶段，可以通过compiler对象去操作webpack。

> 值得一提的是这种注册方式，目前webpack已经不推荐。

### compiler和compilation

* compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。

* compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。**一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。**

区别：
compiler是整个编译过程的对象（因为开发者可能使用了守护进程，dev开发模式），而compilation是某次编译的对象。


### 事件流

webpack的编译过程就像是工厂里的无数条生产线，比方说工厂它具有生产引擎和车门的能力，开始他们是在一条生产线上的，因为要制作外壳。随后通过流水线分拣，进入了不同的加工地带。分拣类似于事件。webpack基于tapable这个模块来组织事件的派发。整个机制就是观察者模式。

刚刚提到的compiler和compilation对象，可以直接在对象上广播和监听事件。

异步事件
```js
compiler.plugin('emit', function (compilation, callback) {
  // 支持处理逻辑
  // 处理完毕后执行 callback 以通知Webpack
  // 如果不执行callback，运行流程会一直卡在这里而不往后执行
  callback();
})
```

这些事件可以在官网看到，是同步事件还是async事件

### compiler hooks
