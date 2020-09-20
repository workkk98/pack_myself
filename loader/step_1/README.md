# Loader

loader实质上就是个函数，将传入的内容，编译后返回。

函数内的this指向webpack对象。

> 在使用loader解析字符串时，注意单双引号转义的问题。

### loader.options

对一个文件转换可能需要多个loader，每个loader都可以配置一些内容，例如css-loader可以配置是否对url函数的启用。如何拿到对应的options呢？

可以在loader中引用这个库```const loaderUtils =require (’ loader-utils ’);```

### 返回其他结果

loader不仅可以通过return返回单一的结果，还能通过callback函数。这个callback是webpack提供的，所以得这样使用。

callback(error | null, content: string | buffer, sourceMap?, abstractSyntaxTree?)
```js
function (source) {
  this.callback(null, source, SourceMap, AST)
}
```

### 同步和异步

### 处理二进制数据

### 缓存加速
