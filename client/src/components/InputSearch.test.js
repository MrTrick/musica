import React from 'react';
import ReactDOM from 'react-dom';
import InputSearch from './InputSearch';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<InputSearch />, div);
  ReactDOM.unmountComponentAtNode(div);
});

//TODO more tests
