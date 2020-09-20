# HMR

### 热更新

* 开发模式 - 热更新
* 入口文件需调用module.hot.accept()函数

### 热更新原理

热更新实际上在不刷新浏览器的情况下，重新替换、添加或删除模块。

在一个chunk中，被修改的引用模块会重新运行，导致在入口文件的导入变量会修改。
举个例子

```js
import printMe from './printMe';
// A情况
button.onclick = printMe;
// B情况
button.onclick = function () {
  printMe();
}
```

这两者的结果是不同的，因为在热更新后，printMe指向的函数重新加载了。B情况调用匿名函数时，会通过函数链找到更新后的printMe，而A情况绑定的还是之前的printMe函数。