# 如何去监听一个webpack进程

[webpack-debugging](https://webpack.js.org/contribute/debugging/)

1. install node-nightly
2. 配置webpack.config.js
3. ```node-nightly --inspect-brk ./node_modules/webpack/bin/webpack.js --config webpack.config.js --watch```
4. 打开chrome://inspect