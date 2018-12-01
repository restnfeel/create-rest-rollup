import React, { Component } from "react";

import { Provider } from 'mobx-react';

import Spa from './components/Spa';

import BasicStore from './stores/BasicStore';

const basic = new BasicStore();

/**
 * @author restnfeel@gmail.com
 **/
class Index extends Component {
  render() {
    return (
      <Provider basic={basic}>
        <Spa/>
      </Provider>
    );
  }
}

export default Index;
