import { Component } from 'react'

import type { PropsWithChildren } from 'react'

import './app.scss'

class App extends Component<PropsWithChildren> {

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children
  }
}


export default App
