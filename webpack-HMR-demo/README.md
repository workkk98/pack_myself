# a minimum and pure example of **webpack hot module replacement**


# HMR

### 开启HMR

官网的demo是需要自己在config.js文件里配置插件的HotModuleReplacementPlugin。

原po这里使用了不同的办法
1. webpack.config.js文件里配置

```js
	devServer: {
		hot: true
	}
```

2. package.json 文件中添加如下的 script 脚本：

```json
"start": "webpack-dev-server --hot --open"
```

> devServer 会告诉 webpack 自动引入 HotModuleReplacementPlugin 插件，而不用我们再手动引入了。

## 整个HMR的流程

### webpack对文件系统进行watch打包到内存

```js
// webpack-dev-middleware/lib/Shared.js
if(!options.lazy) {
    var watching = compiler.watch(options.watchOptions, share.handleCompilerCallback);
    context.watching = watching;
}
```

>你可能会疑问了，为什么 webpack 没有将文件直接打包到 output.path 目录下呢？文件又去了哪儿？原来 webpack 将 bundle.js 文件打包到了内存中，不生成文件的原因就在于访问内存中的代码比访问文件系统中的文件更快(这个实际上从操作系统的原理上来解释的话，CPU只能访问寄存器和内存如果写入磁盘，还有IO操作就势必慢了很多)，

而且也减少了代码写入文件的开销，这一切都归功于memory-fs，memory-fs 是 webpack-dev-middleware 的一个依赖库，webpack-dev-middleware 将 webpack 原本的 outputFileSystem 替换成了MemoryFileSystem 实例，这样代码就将输出到内存中。webpack-dev-middleware 中该部分源码如下。当浏览器请求 bundle.js 文件时，**devServer就直接去内存中找到上面保存的 javascript 对象返回给浏览器端。**

```js
  // webpack-dev-middleware/lib/Shared.js setFs函数
  var isMemoryFs = !compiler.compilers && compiler.outputFileSystem instanceof MemoryFileSystem;
  if(isMemoryFs) {
    fs = compiler.outputFileSystem;
  } else {
    fs = compiler.outputFileSystem = new MemoryFileSystem();
  }
```

### 第二步: devServer 通知浏览器端文件发生改变

> 在这一阶段，sockjs是服务端和浏览器端之间的桥梁。在启动 devServer 的时候，会创建一个sockServer服务。当浏览器访问该devServer服务的时候，就通过该sockServer在服务端和浏览器端建立了一个 webSocket 长连接。以便将 webpack 编译和打包的各个阶段状态告知浏览器。

```js
  // node_modules/webpack-dev-server/lib/Server.js 代码截取自2.x版本的webpack-dev-server
  const sockServer = sockjs.createServer({
    // Use provided up-to-date sockjs-client
    sockjs_url: '/__webpack_dev_server__/sockjs.bundle.js',
    // Limit useless logs
    log(severity, line) {
      if (severity === 'error') {
        log(line);
      }
    }
  });


  sockServer.on('connection', (conn) => {
    if (!conn) return;
    if (!this.checkHost(conn.headers) || !this.checkHost(conn.headers, 'origin')) {
      this.sockWrite([conn], 'error', 'Invalid Host/Origin header');
      conn.close();
      return;
    }
    this.sockets.push(conn);

    conn.on('close', () => {
      const connIndex = this.sockets.indexOf(conn);
      if (connIndex >= 0) {
        this.sockets.splice(connIndex, 1);
      }
    });

    if (this.clientLogLevel) { this.sockWrite([conn], 'log-level', this.clientLogLevel); }

    if (this.progress) { this.sockWrite([conn], 'progress', this.progress); }

    if (this.clientOverlay) { this.sockWrite([conn], 'overlay', this.clientOverlay); }

    if (this.hot) this.sockWrite([conn], 'hot');

    if (!this._stats) return;
    this._sendStats([conn], this._stats.toJson(clientStats), true);
  });
```

上面的代码看到建立好连接后，就会向浏览器端发送状态。其中hot，实际上就是对应
> [WDS] Hot Module Replacement enabled.

**最关键的步骤还是 webpack-dev-server 调用 webpack api 监听 compile的 done 事件**，当compile 完成后，webpack-dev-server通过 _sendStatus 方法将编译打包后的新模块 hash 值发送到浏览器端。

```js
  // node_modules/webpack-dev-server/lib/Server.js
  compiler.plugin('done', (stats) => {
    this._sendStats(this.sockets, stats.toJson(clientStats));
    this._stats = stats;
  });
```

### 第三步：webpack-dev-server/client 接收到服务端消息做出响应

前面提到了，浏览器向sockServer建立连接，可在用户代码里是没有写入半点关于这方面的内容的，那关于这方面的代码是谁引入的？原来是 webpack-dev-server 修改了webpack 配置中的 entry 属性，在里面添加了 webpack-dev-client 的代码，这样在最后的 bundle.js 文件中就会有接收 websocket 消息的代码了。

```js
// node_modules/webpack-dev-server/lib/util/addDevServerEntrypoints.js

module.exports = function addDevServerEntrypoints(webpackOptions, devServerOptions, listeningApp) {
  if (devServerOptions.inline !== false) {
    // we're stubbing the app in this method as it's static and doesn't require
    // a listeningApp to be supplied. createDomain requires an app with the
    // address() signature.
    const app = listeningApp || {
      address() {
        return { port: devServerOptions.port };
      }
    };
    const domain = createDomain(devServerOptions, app);
    const devClient = [`${require.resolve('../../client/')}?${domain}`];

    if (devServerOptions.hotOnly) { devClient.push('webpack/hot/only-dev-server'); } else if (devServerOptions.hot) { devClient.push('webpack/hot/dev-server'); }

    const prependDevClient = (entry) => {
      if (typeof entry === 'function') {
        return () => Promise.resolve(entry()).then(prependDevClient);
      }
      if (typeof entry === 'object' && !Array.isArray(entry)) {
        const entryClone = {};
        Object.keys(entry).forEach((key) => {
          entryClone[key] = devClient.concat(entry[key]);
        });
        return entryClone;
      }
      return devClient.concat(entry);
    };

    [].concat(webpackOptions).forEach((wpOpt) => {
      wpOpt.entry = prependDevClient(wpOpt.entry);
    });
  }
};

```

最后我们可以获得这样的entry
```js
entry = [
'/Users/zhanghefan/web/webpack-HMR-demo/node_modules/webpack-dev-server/client/index.js?http://localhost:8080',
'webpack/hot/dev-server',
'./index.js',
]
```

我们知道entry中赋值一个字符串数组，可以将多个独立文件创建一个独立的文件。（webpack
称之为"multi-main entry"）

然后我们依次可以查看数组前两个文件，

其中第一个文件(webpack-dev-server/client/index.js?http://localhost:8080)为什么会有带"?http://localhost:8080"(我暂时还不知道，或许和loader有些关系？因为客户端中的client-js明显于源码不同，这必然是loader带来的影响。)

> 值得一提的是，未开启HMR，则只会有第一个文件。

```js
//webpack-dev-server/client/index.js?http://localhost:8080
if (typeof window !== 'undefined') {
  var qs = window.location.search.toLowerCase();
  hotReload = qs.indexOf('hotreload=false') === -1; // 通过url访问，你甚至可以手动关闭hotReload
}

// onSocketMsg对象很长，这里我只截取部分属性。
var onSocketMsg = {
  hot: function hot() {
    _hot = true;
    log.info('[WDS] Hot Module Replacement enabled.');
  },
  hash: function hash(_hash) {
    currentHash = _hash;
  },
  'still-ok': function stillOk() {
    log.info('[WDS] Nothing changed.');
    if (useWarningOverlay || useErrorOverlay) overlay.clear();
    sendMsg('StillOk');
  },
  'log-level': function logLevel(level) {
    var hotCtx = require.context('webpack/hot', false, /^\.\/log$/);
    if (hotCtx.keys().indexOf('./log') !== -1) {
      hotCtx('./log').setLogLevel(level);
    }
    switch (level) {
      case INFO:
      case ERROR:
        log.setLevel(level);
        break;
      case WARNING:
        // loglevel's warning name is different from webpack's
        log.setLevel('warn');
        break;
      case NONE:
        log.disableAll();
        break;
      default:
        log.error('[WDS] Unknown clientLogLevel \'' + level + '\'');
    }
  },
  overlay: function overlay(value) {
    if (typeof document !== 'undefined') {
      if (typeof value === 'boolean') {
        useWarningOverlay = false;
        useErrorOverlay = value;
      } else if (value) {
        useWarningOverlay = value.warnings;
        useErrorOverlay = value.errors;
      }
    }
  },
  progress: function progress(_progress) {
    if (typeof document !== 'undefined') {
      useProgress = _progress;
    }
  },

  'progress-update': function progressUpdate(data) {
    if (useProgress) log.info('[WDS] ' + data.percent + '% - ' + data.msg + '.');
  },
  ok: function ok() {
    sendMsg('Ok');
    if (useWarningOverlay || useErrorOverlay) overlay.clear();
    if (initial) return initial = false; // eslint-disable-line no-return-assign
    reloadApp();
  },

  'content-changed': function contentChanged() {
    log.info('[WDS] Content base changed. Reloading...');
    self.location.reload();
  },
  close: function close() {
    log.error('[WDS] Disconnected!');
    sendMsg('Close');
  }
};

// 建立websocket的连接，socket函数非常简单，这里就不在赘述了。
socket(socketUrl, onSocketMsg);

function reloadApp () {
  if (isUnloading || !hotReload) {
    return;
  }
  if (_hot) {
    log.info('[WDS] App hot update...');
    // eslint-disable-next-line global-require
    var hotEmitter = require('webpack/hot/emitter');
    hotEmitter.emit('webpackHotUpdate', currentHash);
    if (typeof self !== 'undefined' && self.window) {
      // broadcast update to window
      self.postMessage('webpackHotUpdate' + currentHash, '*');
    }
  } else {
    var rootWindow = self;
    // use parent window for reload (in case we're in an iframe with no valid src)
    var intervalId = self.setInterval(function () {
      if (rootWindow.location.protocol !== 'about:') {
        // reload immediately if protocol is valid
        applyReload(rootWindow, intervalId);
      } else {
        rootWindow = rootWindow.parent;
        if (rootWindow.parent === rootWindow) {
          // if parent equals current window we've reached the root which would continue forever, so trigger a reload anyways
          applyReload(rootWindow, intervalId);
        }
      }
    });
  }

  function applyReload(rootWindow, intervalId) {
    clearInterval(intervalId);
    log.info('[WDS] App updated. Reloading...');
    rootWindow.location.reload();
  }
}
```

// reloadApp函数，在onSocketMsg中'ok'以及'warning'钩子上都有定义。
if(_hot)分支中，获取了hotEmitter对象调用了emit函数，并且参数是currentHash。
这个事件与第二个文件有关。

```js

// node_modules/webpack/hot/dev-server.js
if(module.hot) {
	var lastHash;
	var upToDate = function upToDate() {
		return lastHash.indexOf(__webpack_hash__) >= 0;
	};
	var log = require("./log");
	var check = function check() {
		module.hot.check(true).then(function(updatedModules) {
			if(!updatedModules) {
				log("warning", "[HMR] Cannot find update. Need to do a full reload!");
				log("warning", "[HMR] (Probably because of restarting the webpack-dev-server)");
				window.location.reload();
				return;
			}

			if(!upToDate()) {
				check();
			}

			require("./log-apply-result")(updatedModules, updatedModules);

			if(upToDate()) {
				log("info", "[HMR] App is up to date.");
			}

		}).catch(function(err) {
			var status = module.hot.status();
			if(["abort", "fail"].indexOf(status) >= 0) {
				log("warning", "[HMR] Cannot apply update. Need to do a full reload!");
				log("warning", "[HMR] " + err.stack || err.message);
				window.location.reload();
			} else {
				log("warning", "[HMR] Update failed: " + err.stack || err.message);
			}
		});
	};
	var hotEmitter = require("./emitter");
	hotEmitter.on("webpackHotUpdate", function(currentHash) {
		lastHash = currentHash;
		if(!upToDate() && module.hot.status() === "idle") {
			log("info", "[HMR] Checking for updates on the server...");
			check();
		}
	});
	log("info", "[HMR] Waiting for update signal from WDS...");
} else {
	throw new Error("[HMR] Hot Module Replacement is disabled.");
}
```

在监听到webpackHotUpdate事件。

1. upToDate，hash和之前编译的hash值是否相同。
> __webpack_hash__提供对编译过程中(compilation)的 hash 信息的访问。

2. 检查module.hot.status()是否是闲置（这一步应该是为了防止用户多次修改内容，而导致client的卡顿）

然后就是调用check函数。函数内部调用了`module.hot.accept`这个方法。
```js
// node_modules/webpack/lib/HotModuleReplacement.runtime.js
	function hotCheck(apply) {
		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
		hotApplyOnUpdate = apply;
		hotSetStatus("check");
		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
			if(!update) {
				hotSetStatus("idle");
				return null;
			}
			hotRequestedFilesMap = {};
			hotWaitingFilesMap = {};
			hotAvailableFilesMap = update.c;
			hotUpdateNewHash = update.h;

			hotSetStatus("prepare");
			var promise = new Promise(function(resolve, reject) {
				hotDeferred = {
					resolve: resolve,
					reject: reject
				};
			});
			hotUpdate = {};
			/*foreachInstalledChunks*/
			{ // eslint-disable-line no-lone-blocks
				/*globals chunkId */
				hotEnsureUpdateChunk(chunkId);
			}
			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
				hotUpdateDownloaded();
			}
			return promise;
		});
	}

  // JsonpMainTemplate.runtime
	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
		requestTimeout = requestTimeout || 10000;
		return new Promise(function(resolve, reject) {
			if(typeof XMLHttpRequest === "undefined")
				return reject(new Error("No browser support"));
			try {
				var request = new XMLHttpRequest();
				var requestPath = $require$.p + $hotMainFilename$;
				request.open("GET", requestPath, true);
				request.timeout = requestTimeout;
				request.send(null);
			} catch(err) {
				return reject(err);
			}
			request.onreadystatechange = function() {
				if(request.readyState !== 4) return;
				if(request.status === 0) {
					// timeout
					reject(new Error("Manifest request to " + requestPath + " timed out."));
				} else if(request.status === 404) {
					// no update available
					resolve();
				} else if(request.status !== 200 && request.status !== 304) {
					// other failure
					reject(new Error("Manifest request to " + requestPath + " failed."));
				} else {
					// success
					try {
						var update = JSON.parse(request.responseText);
					} catch(e) {
						reject(e);
						return;
					}
					resolve(update);
				}
			};
		});
	}
```

check函数中，先检查hotStatus状态，并设置状态。随后调用hotDownloadManifest函数，该函数实际上就是下发一个http请求。该函数的意义实际上就是获取本次更新完成后，哪些文件改动了的清单。
其中的`requestPath = $require$.p + $hotMainFilename$`;
在编译后就是`var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json"`

不难看出，requestPath中包含了刚刚返回的hash值。请求完成后，返回的响应对象为
```js
var update = {
  c: {0: true}
  h: "107dda5f8bbe91773b90"
}
```

最后返回了一个promise。再回到check函数中，初始化几个变量后，尤其是这个chunkid，源码和编译后的代码是不同的。
执行hotEnsureUpdateChunk函数（应当是确保，不会重复加载相同的chunk？）
最后会调用hotDownloadUpdateChunk这个函数，也就是从服务器上获取对应的变更文件。

> 最关键的是check函数最后返回了一个promise函数，这个promise可以通过hotDeferred这个钥匙来决定状态。(这里先点一下)

```js
	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.charset = "utf-8";
		script.src = $require$.p + $hotChunkFilename$;
		$crossOriginLoading$;
		head.appendChild(script);
	}
```

通过jsonp，加载变更的模块。下载完的文件大致是这样的。
```js
webpackHotUpdate(0,{

/***/ 29:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
const hello = () => 'hello world2!'
/* harmony default export */ __webpack_exports__["default"] = (hello);

/***/ })

})
```
既然我们已经获取了最新的模块，那随后整个过程就是应用该模块。
依次会调用一下函数:
1. webpackHotUpdateCallback
2. hotAddUpdateChunk
3. hotUpdateDownloaded
```js
// node_modules/webpack/lib/HotModuleReplacement.runtime.js
	function hotUpdateDownloaded() {
		hotSetStatus("ready");
		var deferred = hotDeferred;
		hotDeferred = null;
		if(!deferred) return;
		if(hotApplyOnUpdate) {
			// Wrap deferred object in Promise to mark it as a well-handled Promise to
			// avoid triggering uncaught exception warning in Chrome.
			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
			Promise.resolve().then(function() {
				return hotApply(hotApplyOnUpdate);
			}).then(
				function(result) {
					deferred.resolve(result);
				},
				function(err) {
					deferred.reject(err);
				}
			);
		} else {
			var outdatedModules = [];
			for(var id in hotUpdate) {
				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
					outdatedModules.push(toModuleId(id));
				}
			}
			deferred.resolve(outdatedModules);
		}
	}
```

不知道你发现了吗，刚刚提到的hotDeferred对象在这里使用到了，原来是在加载新的模块文件时，使用了这把"钥匙"。

函数内部会进入第一个if分支语句，接下来会执行hotApply函数。该函数篇幅比较长。

```js
  // node_modules/webpack/lib/HotModuleReplacement.runtime.js
  // hotApply函数
		var error = null;
		for(moduleId in outdatedDependencies) {
			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
				module = installedModules[moduleId];
				if(module) {
					moduleOutdatedDependencies = outdatedDependencies[moduleId];
					var callbacks = [];
					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
						dependency = moduleOutdatedDependencies[i];
						cb = module.hot._acceptedDependencies[dependency];
						if(cb) {
							if(callbacks.indexOf(cb) >= 0) continue;
							callbacks.push(cb);
						}
					}
					for(i = 0; i < callbacks.length; i++) {
						cb = callbacks[i];
						try {
							cb(moduleOutdatedDependencies);
						} catch(err) {
							if(options.onErrored) {
								options.onErrored({
									type: "accept-errored",
									moduleId: moduleId,
									dependencyId: moduleOutdatedDependencies[i],
									error: err
								});
							}
							if(!options.ignoreErrored) {
								if(!error)
									error = err;
							}
						}
					}
				}
			}
		}
```

这一步，从用户注册到module.hot.accept函数中到回调函数，通过判断模块的名称，来获取对应的回调函数队列并执行。

值得一提的是在处理用户回调函数的时候，会使用try-catch来提示用户。（这个应该是优秀模块的基本操作）

最后就是执行用户的回调函数了。值得一提的是，官方特别提到：
> 当使用 ESM import 时，所有从 dependencies 中导入的符号都会自动更新。

这是因为编译的时候，特别调整了这方面的语句，重新调用了新模块(这也符合ES6import是个接口的规范)。而使用commonjs，则不会有这方面的调整。也就是说你得人为重新调用require函数，获取新的变量、方法。

```js
if (true) {
  module.hot.accept(29, function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ __WEBPACK_IMPORTED_MODULE_0__hello_js__ = __webpack_require__(29); (function () {
    div.innerHTML = Object(__WEBPACK_IMPORTED_MODULE_0__hello_js__["default"])();
  })(__WEBPACK_OUTDATED_DEPENDENCIES__); })
}

```