import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './App';

const initialState = {
  isLoading: false,
  isLoaded: false,
  isPlaying: false,

  tracks: [],
  current: null,
  index: 0,
  progress: 0,
  filter: ''
};

it('renders without crashing', () => {
  const store = createStore(()=>initialState);
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}><App /></Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});

//TODO more tests
