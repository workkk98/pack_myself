# webpack起步

### tree-shake（摇树）

dead code(无用代码)

中文文档没有具体写出webpack.config.js的配置。必须开启一项配置
```js
// webpack.config.js

module.exports = {
  optimization: {
    usedExports: true
  }
}

```

webpack英文文档有一小节文章: [澄清tree shaking和sideEffects](https://webpack.js.org/guides/tree-shaking/#clarifying-tree-shaking-and-sideeffects)

> The sideEffects and usedExports (more known as tree shaking) optimizations are two different things.

文档中介绍道，sideEffects会更有效，它允许跳过整个模块/文件。
usedExports依赖于terser，探测有副作用的声明。

**sideEffect**

> It's similar to /*#__PURE__*/ but on a module level instead of a statement level. It says ("sideEffects" property): "If no direct export from a module flagged with no-sideEffects is used, the bundler can skip evaluating the module for side effects.".

双引号附近的语句可以这么翻译，如果一个被标记了没有副作用，且没有直接的导出语句，打包可以跳过计算这个模块的副作用。