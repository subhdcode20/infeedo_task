import React, {Component} from 'react';
import {Link, Switch} from 'react-router';
import {HashRouter, BrowserRouter, Route} from 'react-router-dom';

import ItemsList from '../components/ItemList';
import Applayout from '../components/Applayout';
// import MyFriends from '../components/App';
// import Chat from '../components/Chat';
// import Login from '../components/Login';
// import Apphome from '../components/AppHome/index';
// import Settings from '../components/Settings/index';
// import UsersNearby from '../components/UsersNearby';
// import Profile from '../components/Profile';
import Cart from '../components/Cart';
import OrderHistory from '../components/OrderHistory';

import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory()

// const DiscoverComponent = Loadable({
//   loader: () => import(/* webpackChunkName: "discover" */ '../components/Discover/discover'),
//   loading: Loading,
// });

// const MyFriendsComponent = Loadable({
//   loader: () => import(/* webpackChunkName: "friends" */ '../components/App'),
//   loading: Loading,
// });
//
// const ChatComponent = Loadable({
//   loader: () => import(/* webpackChunkName: "chat" */ '../components/Chat'),
//   loading: Loading,
// });
//
// const SettingsComponent = Loadable({
//   loader: () => import(/* webpackChunkName: "settings" */ '../components/Settings/index'),
//   loading: Loading,
// });

// const StoriesComponent = Loadable({
//   loader: () => import(/* webpackChunkName: "stories" */ '../components/StoriesDesignTest/swipeableViews'),
//   loading: Loading,
// });

// const NearbyImagesComponent = Loadable({
//   loader: () => import(/* webpackChunkName: "nearbyimages" */ '../components/NearbyImages/index'),
//   loading: Loading,
// });


class Routes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      index: 0
    }
  }

  render() {
    console.log('Route render');
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
// <Route exact path="/friends" component={() => (<AppLayout><MyFriends /></AppLayout>)} />
// <Route exact path="/chat" component={() => (<Chat />)} />
// <Route exact path="/settings" component={() => (<AppLayout><Settings /></AppLayout>)} />
//
// <Route exact path="/nearby" component={() => (<AppLayout><UsersNearby /></AppLayout>)} />
// <Route exact path="/profile" component={() => (<Profile />)} />

export default Routes
