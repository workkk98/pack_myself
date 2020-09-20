# vue-loader打包过程

### 经过vue-loader编译后

```
"import { render, staticRenderFns } from "./app.vue?vue&type=template&id=5ef48958&scoped=true&"
import script from "./app.vue?vue&type=script&lang=js&"
export * from "./app.vue?vue&type=script&lang=js&"


/* normalize component */
import normalizer from "!../node_modules/vue-loader/lib/runtime/componentNormalizer.js"
var component = normalizer(
  script,
  render,
  staticRenderFns,
  false,
  null,
  "5ef48958",
  null
  
)

/* hot reload */
if (module.hot) {
  var api = require("/Users/zhanghefan/web/webpack/vue-loader/node_modules/vue-hot-reload-api/dist/index.js")
  api.install(require('vue'))
  if (api.compatible) {
    module.hot.accept()
    if (!api.isRecorded('5ef48958')) {
      api.createRecord('5ef48958', component.options)
    } else {
      api.reload('5ef48958', component.options)
    }
    module.hot.accept("./app.vue?vue&type=template&id=5ef48958&scoped=true&", function () {
      api.rerender('5ef48958', {
        render: render,
        staticRenderFns: staticRenderFns
      })
    })
  }
}
component.options.__file = "src/app.vue"
export default component.exports"
```

![](/Users/zhanghefan/Library/Application Support/typora-user-images/截屏2020-09-20 下午10.42.56.png)



plugin

![截屏2020-09-20 下午11.19.18](/Users/zhanghefan/Desktop/截屏2020-09-20 下午11.19.18.png)



实践

![截屏2020-09-21 上午12.17.17](/Users/zhanghefan/Desktop/截屏2020-09-21 上午12.17.17.png)

