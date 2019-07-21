import React, {Component} from 'react';
import {HashRouter, Route} from 'react-router-dom';

import ItemsList from '../components/ItemList';
import Applayout from '../components/Applayout';
import Cart from '../components/Cart';
import OrderHistory from '../components/OrderHistory';

import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory();


class Routes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      index: 0
    }
  }

  render() {
    return (
      <HashRouter history={history}>
        <div>
          <Route exact path="/" component={() => (<Applayout><ItemsList /></Applayout>)} />
          <Route exact path="/cart" component={() => (<Applayout><Cart /></Applayout>)} />
          <Route exact path="/orderHistory" component={() => (<Applayout><OrderHistory /></Applayout>)} />
        </div>
      </HashRouter>
    )
  }
}

export default Routes
