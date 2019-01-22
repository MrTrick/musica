import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './NavBar';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <NavBar filter='' handleSearch={()=>{}} />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it('looks like it should', () => {
  const wrapper = shallow(
    <NavBar filter='Alt Rock' handleSearch={()=>{}} />
  ).dive(); //Go down one level because top-level isn't helpful.

  expect(wrapper).toMatchSnapshot();
});
