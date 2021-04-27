# DefinePlugin

该插件可以在编译过程中，向源码注入变量。利用这一点，以及webpack会消除deadcode，我们可以在不同的打包环境下，引入不同的模块。

### 定义变量

```js
  new webpack.DefinePlugin({
    TARGET: JSON.stringify(process.env.NODE_ENV),
    VERSION: JSON.stringify('5fa3b9'),
    BROWSER_SUPPORTS_HTML5: true,
    TWO: '1+1',
    'typeof window': JSON.stringify('object'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  })
```

> If the value is a string it will be used as a code fragment.
If the value isn't a string, it will be stringified (including functions).
If the value is an object all keys are defined the same way.
If you prefix typeof to the key, it's only defined for typeof calls.

第一第二条用的比较多，例如boolean就会被转换成string，再编译时用作为来code片段。
所以编译的源码中，该变量仍是布尔值