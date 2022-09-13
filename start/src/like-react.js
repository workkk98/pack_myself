class React {}


function astToDom(ast, target) {
  target.appendChild(
    document.createElement('div')
  )
}

React.Component = class ReactComponent {
  constructor() {
    this.$el = document.createElement('fragment')
  }

  _update() {
    const ast = this.render()
    astToDom(ast)
  }

}