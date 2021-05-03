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


> * If the value is a string it will be used as a code fragment.
> * If the value isn't a string, it will be stringified (including functions).
> * If the value is an object all keys are defined the same way.
> * If you prefix typeof to the key, it's only defined for typeof calls.

第一第二条用的比较多，例如boolean就会被转换成string，再编译时用作为来code片段。所以编译的源码中，该变量仍是布尔值。

第三条：定义一个value为对象时，对象及对象内部的属性都是会定义在webpack的全局变量里的。可以看./index.js中的例子。（有点小区别就是，在if语句中访问该对象，webpack会把它直接编译成true）

第四条可以直接看./index.js中的例子，当你使用typeof calls时，就会被替换成全局变量。

### 原理

> Note that because the plugin does a direct text replacement, the value given to it must include actual quotes inside of the string itself. 

这段话摘自webpack，也阐述了原理，就是把定义到变量名对应值替换到到源码中。