import React from 'react';
import { render as ReactDomRender, Switch } from 'react-dom';
import { Route, HashRouter, BrowserRouter  } from 'react-router-dom';
import { Provider } from 'react-redux';

import ReduxStore from './reducers/store';
import Routes from './routes/routes.js'

// const theme = createMuiTheme({
//   palette: {
//     primary: { main: `${FIRST_COLOR}` }, // Purple and green play nicely together.
//     secondary: { main: `${SECOND_COLOR}` }, // This is just green.A700 as hex.
//   },
// });

// <MuiThemeProvider>
ReactDomRender(
  <Provider store={ReduxStore}>
    <div>
      <Routes />
    </div>
  </Provider>,
  document.getElementById('app')
);
// </MuiThemeProvider>
