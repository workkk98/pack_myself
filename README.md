# webpack

对webpack还是非常好奇，所以带着一点点的基础重新开始学习。这次从v5版本开始。

## webpack介绍
webpack本质上是个事件流的机制，它的工作流程就是将各个插件串联起来。
webpack中**最核心的负责编译的Compiler和负责创建bundles的Compilation都是Tapable的实例。**
[tapable](https://github.com/webpack/tapable)


### webpack可执行文件

这个文件会检查下webpack-cli是否安装， 最终还是会收敛到webpack-cli做一个处理。值得学习的地方就在于这个交互式的安装webpack-cli的代码，后面可以了解下。

```js
	const questionInterface = readLine.createInterface({
		input: process.stdin,
		output: process.stderr
	});

	// In certain scenarios (e.g. when STDIN is not in terminal mode), the callback function will not be
	// executed. Setting the exit code here to ensure the script exits correctly in those cases. The callback
	// function is responsible for clearing the exit code if the user wishes to install webpack-cli.
	process.exitCode = 1;
	questionInterface.question(question, answer => {
		questionInterface.close();

		const normalizedAnswer = answer.toLowerCase().startsWith("y");

		if (!normalizedAnswer) {
			console.error(
				"You need to install 'webpack-cli' to use webpack via CLI.\n" +
					"You can also install the CLI manually."
			);

			return;
		}
		process.exitCode = 0;

		console.log(
			`Installing '${
				cli.package
			}' (running '${packageManager} ${installOptions.join(" ")} ${
				cli.package
			}')...`
		);

		runCommand(packageManager, installOptions.concat(cli.package))
			.then(() => {
				runCli(cli);
			})
			.catch(error => {
				console.error(error);
				process.exitCode = 1;
			});
	});
```


### webpack核心(lib/webpack.js)


createCompiler
```js
const createCompiler = rawOptions => {
	const options = getNormalizedWebpackOptions(rawOptions);
	applyWebpackOptionsBaseDefaults(options);
	const compiler = new Compiler(options.context, options);
	new NodeEnvironmentPlugin({
		infrastructureLogging: options.infrastructureLogging
	}).apply(compiler);
	if (Array.isArray(options.plugins)) {
		for (const plugin of options.plugins) {
			if (typeof plugin === "function") {
				plugin.call(compiler, compiler);
			} else {
				plugin.apply(compiler);
			}
		}
	}
	applyWebpackOptionsDefaults(options);
	compiler.hooks.environment.call();
	compiler.hooks.afterEnvironment.call();

	// 可以看下这个process的调用，在这一步，webpack加上了很多的plugin（所以webpack这个架构是非常灵活的）
	// 举几个例子，例如EntryOptionPlugin、ExternalPlugin、devtoolPlugin、HarmonyModulesPlugin、SplitChunksPlugin
	// start/node_modules/webpack/lib/WebpackOptionsApply.js
	new WebpackOptionsApply().process(options, compiler);
	compiler.hooks.initialize.call();
	return compiler;
};
```


#### tapable

类似于EventEmmiter一样的类

**SyncHook**

```


BMW.hooks.accelerate.tap("LoggerPlugin" , (newSpeed,unit) => console.log(`newSpeed is ${newSpeed+unit}`))

accelerate(newSpeed , unit) {
  return this.hooks.accelerate.call(newSpeed , unit)
}
BMW.accelerate(60,'mph')
```
new SyncHook()应该是个函数
同步hook就是通过tap方法在这个**函数对象**上增加监听函数，调用hook后 依次执行。

值得注意一点，hook 是按照(this,...参数数组)的形式调用监听函数的(因为用了call调用函数) 或者是修改了call函数？


#### webpack 入口

```
const webpack = (options, callback) => {
    // ...
    // 验证options正确性
    // 预处理options
  options = new WebpackOptionsDefaulter().process(options); // webpack4的默认配置
	compiler = new Compiler(options.context); // 实例Compiler
	// ...
  // 若options.watch === true && callback 则开启watch线程 fs.watch？
	compiler.watch(watchOptions, callback);
	compiler.run(callback);
	return compiler;
};

```

入口文件中，实例化了compiler对象 ， 并调用compiler.run(callback)


#### 编译的执行顺序(compiler.run)
* before-run 清除缓存
* run 注册缓存数据钩子
* before-compile
* compile 开始编译
* make 从入口分析依赖以及间接依赖模块，创建模块对象
* build-module 模块构建
* seal 构建结果封装， 不可再更改
* after-compile 完成构建，缓存数据
* emit 输出到dist目录


### compilation 一次构建时的对象

#### entries（Map实例）

每次构建时一个entry对应一个entryData
```js
const entryData = {
	dependencies: [],
	includeDependencies: [],
	options: {
		name: undefined,
		...options
	}
};
```

includeDependencies不太清楚是啥意思。但是dependencies就是指本次入口的依赖，包括自己本身。

#### 参考链接

[webpack详解](https://juejin.im/post/5aa3d2056fb9a028c36868aa)