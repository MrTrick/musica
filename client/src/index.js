import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';

import App from './components/App';
import rootReducer from './reducers';
import theme from './theme';

require('typeface-roboto');

const middlewares = [];
if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);
  middlewares.push(logger);
}

const store = createStore(rootReducer, applyMiddleware(...middlewares));

render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
