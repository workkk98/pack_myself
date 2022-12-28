import { cube } from './math';
cube(2);

// function component() {
//   const element = document.createElement('pre');

//   element.innerHTML = [
//     'Hello webpack',
//     '5 cubed is equal to ' + cube(5)
//   ].join('\n\n');


//   return element;
// }
// document.body.appendChild(component())

class Foo extends React.Component {

}

console.log('Foo', new Foo)
const mode = process.env.NODE_ENV
document.title = mode

// 写一个没有dependency的入口文件
document.body = 'hello world'

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

insertDynamicComponent()
insertDynamicComponent2()