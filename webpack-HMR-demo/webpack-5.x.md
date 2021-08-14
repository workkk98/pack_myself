# HMR

大致上架构我想同之前3.x版本的webpack以相关模块是一样的。这里仅是探究些我想实验的内容，和一些API。


### Compiler Hooks

dev-server在监听'done'事件，代码方面有些改动。

```js
  done.tap('webpack-dev-server', (stats) => {
    this._sendStats(this.sockets, this.getStats(stats));
    this._stats = stats;
  });
```

### multi-main entry

webpack-dev-server同样是对入口文件`entry`进行了扩展。

```js
// node_modules/webpack-dev-server/lib/Server.js
Server.addDevServerEntrypoints = require('./utils/addEntries');

// node_modules/webpack-dev-server/lib/utils/addEntries.js
config.entry = prependEntry(config.entry || './src', additionalEntries);
```

其中additionalEntries是一个动态的数组，其中就包含了这两个文件

'/Users/zhanghefan/web/webpack-HMR-demo/node_modules/webpack-dev-server/client/index.js?http://localhost:8080'

'/Users/zhanghefan/web/webpack-HMR-demo/node_modules/webpack/hot/dev-server.js'

令我奇怪的点是，为啥这两个模块是放在不同的npm包里？

### fetch - update.json

webpack ， 因为要适配eletron等非浏览器平台。所以在这里动态的修改，如果获取update-json的方法。

```js

// node_modules/webpack/lib/hmr/HotModuleReplacement.runtime.js

return $hmrDownloadManifest$().then(function (update) {
			if (!update) {
				setStatus(applyInvalidatedModules() ? "ready" : "idle");
				return null;
			}

// node_modules/webpack/lib/web/JsonpChunkLoadingRuntimeModule.js（浏览器获取的源码）

/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
```

