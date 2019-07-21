import React from 'react';
import { render as ReactDomRender } from 'react-dom';
import { Provider } from 'react-redux';

import ReduxStore from './reducers/store';
import Routes from './routes/routes.js'

ReactDomRender(
  <Provider store={ReduxStore}>
    <div>
      <Routes />
    </div>
  </Provider>,
  document.getElementById('app')
);
