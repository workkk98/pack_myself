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

Basic hook (without “Waterfall”, “Bail” or “Loop” in its name). This hook simply calls every function it tapped in a row.

Waterfall. A waterfall hook also calls each tapped function in a row. Unlike the basic hook, it passes a return value from each function to the next function.

Bail. A bail hook allows exiting early. When any of the tapped function returns anything, the bail hook will stop executing the remaining ones.

Loop. When a plugin in a loop hook returns a non-undefined value the hook will restart from the first plugin. It will loop until all plugins return undefined.

### 注册消费者

通过在hooks上调用tap方法注册消费者。
tap(pluginID, callback)
```js
myCar.hooks.brake.tap("WarningLampPlugin", () => warningLamp.on());
```