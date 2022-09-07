const {
  SyncHook,
  SyncBailHook,
  AsyncParallelHook,
  SyncWaterfallHook,
  SyncLoopHook
} = require('tapable')

// console.log(Object.keys(tapable))


/**
 * SyncHook {
      _args: [Array],
      taps: [],
      interceptors: [],
      call: [Function: lazyCompileHook],
      promise: [Function: lazyCompileHook],
      callAsync: [Function: lazyCompileHook],
      _x: undefined
    },
 */
class Car {
  _type = "M2"
  constructor(name) {
    this._band = name

    // 在类里创建一个hooks对象
    this.hooks = {
      accelerate: new SyncHook(['newSpeed','unit']), // 只是调用"消费者"时表明使用参数的长度？
      brake: new SyncHook(),
      pollOver: new AsyncParallelHook(['time' , 'position']),
      // 熔断
      askQuestion: new SyncBailHook(['question']),
      // waterfall 需要上一个plugin的结果的
      takeShower: new SyncWaterfallHook(['price']),
      // sync loop感觉没啥用，因为这里一定是同步的
      sell: new SyncLoopHook(['price'])
    }
  }

  accelerate(newSpeed , unit) {
    return this.hooks.accelerate.call(newSpeed , unit)
  }


  break () {
    return this.hooks.brake.call()
  }

  pollOver (time , positions){
    // this.hooks.pollOver.callAsync(time,positions,function () {
    //   console.log('async callback')
    // })
    // promise似乎会调用callAsync？
    this.hooks.pollOver.promise(time,positions).then(function () {
      console.log('promise callback')
    })
  }

  startAskQuestion() {
    this.hooks.askQuestion.call('哪里能买到M4呀')
  }
}

const BMW = new Car('BMW');
// console.dir(BMW)

// Use the tap method to add a consument 官网原话
BMW.hooks.brake.tap("WarningLampPlugin" , function () {
  console.warn('Warning Lamp')
})

BMW.hooks.accelerate.tap("LoggerPlugin" , (newSpeed,unit) => console.log(`newSpeed is ${newSpeed+unit}`))

// 注册一个同步的消费者 再调用异步函数的时候 会先调用同步函数
BMW.hooks.pollOver.tap("LoggerPlugin" , (time,positions)  => {
  console.log('异步类型Hook的仍可以注册同步的' , time,positions)
})
// 异步有两种形式 一种async 一种promise
BMW.hooks.pollOver.tapAsync("StartPollOverPlugins" , (time,positions,callback) => {
  setTimeout(function () {
    console.log('async' , time , positions)
    callback()
  },time)
})

BMW.hooks.pollOver.tapPromise("EndPollOberPlugins" , (time,positions) => {
  return new Promise(function (resolve,reject) {
    setTimeout(function () {
      resolve('1000ms to poll over')
    },time)
  })
})

BMW.hooks.askQuestion.tap('hangzhou', (question) => {
  console.log('hangzhou askQuestion')
  return undefined
})

BMW.hooks.askQuestion.tap('beijing', () => {
  console.log('beijing askQuestion')
  return 'M4国内只有本店有'
})

BMW.hooks.askQuestion.tap('shanghai', () => {
  console.log('shanghai askQuestion')
  return 'M4国内只有beijing有'
})


BMW.break()
BMW.accelerate(60,'mph')

BMW.pollOver(1000,'my home')

BMW.startAskQuestion()

exports.BMW = BMW