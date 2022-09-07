// waterfall类型的hook

const { BMW } = require('./app')

// 实际上就是第一个参数的传递
BMW.hooks.takeShower.tap('water', (price) => {
  console.log('water', price)
  return ['water']
})

BMW.hooks.takeShower.tap('soap', (price) => {
  console.log('soap', price)
  if (price < 60) return price
  return price.concat('soap')
})

BMW.hooks.takeShower.call(20)