# tapable

### hooks

```js
const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
 } = require("tapable");
```

### 注册消费者

通过在hooks上调用tap方法注册消费者。
tap(pluginID, callback)
```js
myCar.hooks.brake.tap("WarningLampPlugin", () => warningLamp.on());
```