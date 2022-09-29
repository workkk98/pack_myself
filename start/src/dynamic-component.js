// like dynamic component
import { square } from './math'

export const FooComp = {
  render(h) {
    return h('div', {}, [square(2).toString()])
  }
}