import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import thunk from 'redux-thunk';

import { combineReducers } from 'redux';
// import friends from './friends';
// import notification from './notification';
// import login from './login';
// import settings from './settings';
// import discover from './discover';
// import usersNearby from './usersNearby';
// import feeds from './feeds';
import task from './task';

const reducers = combineReducers({
    task
    // friends: friends,
    // notifications: notification,
    // login: login,
    // discover,
    // settings,
    // usersNearby,
    // feeds
});

const createStoreWithMiddleware = applyMiddleware(ReduxPromise, thunk)(createStore);
const store = createStoreWithMiddleware(reducers);

export default store;
