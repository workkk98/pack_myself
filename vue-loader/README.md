# vue-loader

> vue-loader is not a simple source transform loader. It handles each language blocks inside an SFC with its own dedicated loader chain (you can think of each block as a "virtual module"), and finally assembles the blocks together into the final module.

vue-loader不是一个简单的源码转换loader。它处理在SFC(Single-File-Components)中的每个语言块，通过他们专用的loader链，你可以认为每个语言块都是虚拟的模块。最后将每个语言块集合到最后的模块中。

### 流程

1. vue-loader通过@vue/component-compiler-utils解析单文件组件。它对每个语言块生成一个import语句，最后返回的模块像这样。

```js
// code returned from the main loader for 'source.vue'

// import the <template> block
import render from 'source.vue?vue&type=template'
// import the <script> block
import script from 'source.vue?vue&type=script'
export * from 'source.vue?vue&type=script'
// import <style> blocks
import 'source.vue?vue&type=style&index=1'

script.render = render
export default script
```

接下来就是VueLoaderPlugin施展魔法的时候了
2. 每个import语句我们都希望它被配置的打包模块规则所编译。它创建了**一个被修饰过的的克隆规则**，对应不同vue语言块请求（引入语句）。

```js
import script from 'source.vue?vue&type=script'
```
```js
import script from 'babel-loader!vue-loader!source.vue?vue&type=script'
```

被修饰过的克隆规则具体就在这里体现了script语言块在对应规则下应该只有babel-loader，但这里还多加了一条vue-loader。

3. 当处理这些引入语句时，vue-lodaer就被再次调用了。但在这次，vue-loader处理的时候，意识到引入语句有对应的处理loader以及对应的语句块。
所以它引用了内部的语句块并将它传递给对应的loaders。

4. template和style语句块，有一些其他的任务需要被执行。

* 我们需要通过```vue-tempalte compiler```去编译template语句块
* 我们需要去加工scoped css语句块，在css-loader之后，style-loader之前。

这个工作也交给了VueLoaderPlugin。