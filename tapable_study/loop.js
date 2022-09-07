const { BMW } = require('./app')

//  When a plugin in a loop hook returns a non-undefined value the hook will restart from the first plugin.
//  It will loop until all plugins return undefined.
BMW.hooks.sell.tap('foo', (() => {
  let count = 5
  let called = false
  const recursivelyAddCount = (price) => {
    count++
    if (count >= price) return
    setTimeout(() => {
      recursivelyAddCount(price)
    }, 0)
  }

  return (price) => {
    console.log('foo', count)
    if (count < price) {
      count += 10 * Math.random()
      return count
    }
  }
})())


BMW.hooks.sell.tap('bar', (() => {
  let count = 10
  let called = false
  const recursivelyAddCount = (price) => {
    count++
    if (count >= price) return
    recursivelyAddCount(price)
  }

  return (price) => {
    console.log('bar', count)
    if (count < price) {
      count += 10 * Math.random()
      return count
    }
  }
})())


BMW.hooks.sell.call(20)