## appendsTsxSuffix

我原以为这个配置没啥用。但是在这个demo里得出来结论，是有必要的。看下面ts的转换就知道了

关闭appendsTsxSuffix配置
```json
"export default {
    name: 'app',
    components: {
        HelloWorld: {
            data() {
                return {
                    foo: 'foo'
                };
            },
            render() {
                return Hello;
                World < /div>;
            }
        }
    },
};
//# sourceMappingURL=app.vue.js.map"
```
上面的code片段明显在render函数出现了问题。


enable
```json
"export default {
    name: 'app',
    components: {
        HelloWorld: {
            data() {
                return {
                    foo: 'foo'
                };
            },
            render() {
                return <div>Hello World!</div>;
            }
        }
    },
};
//# sourceMappingURL=app.vue.jsx.map"
```

为啥导致这个原因？可能是编译器编译配置对这个后缀名也会有关联