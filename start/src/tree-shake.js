import { cube } from './math';
import { get } from 'lodash'
import cloneDeep from 'lodash/cloneDeep'
cube(2);

const foo = cloneDeep({
  foo: [{ a: 'a' }]
})
console.log(foo)

// function component() {
//   const element = document.createElement('pre');

//   element.innerHTML = [
//     'Hello webpack',
//     '5 cubed is equal to ' + cube(5)
//   ].join('\n\n');


//   return element;
// }
// document.body.appendChild(component())

const mode = process.env.NODE_ENV
document.title = mode

// 写一个没有dependency的入口文件
document.body.textContent = 'hello world'

async function insertDynamicComponent() {
  const components = (await import('./dynamic-component')).default
  window.components = components
  return components
}

async function insertDynamicComponent2() {
  const components = (await import('./dynamic-component-2')).default
  window.components = components
  return components
}

console.log('get strange value', get(window, 'strange.value'))

insertDynamicComponent()
insertDynamicComponent2()