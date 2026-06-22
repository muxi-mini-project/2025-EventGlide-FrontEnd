import { Component } from 'react';

import type { PropsWithChildren } from 'react';

import './app.scss';

import { checkStatus } from './common/api';
import useDoorStore from '@/store/DoorStote';

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    if (useDoorStore.getState().doorStatus === 'loading') {
      this.checkDoorStatus();
    }
  }

  checkDoorStatus = async () => {
    try {
      const res = await checkStatus();
      if (res) {
        if (res.data.status) {
          useDoorStore.getState().setDoorStatus('pass');
        } else {
          useDoorStore.getState().setDoorStatus('block');
        }
      }
    } catch (error) {
      useDoorStore.getState().setDoorStatus('block');
    }
  };
  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;
