import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';

import App from './components/App';

import theme from './theme';
import rootReducer from './reducers';
const store = createStore(rootReducer);

render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
