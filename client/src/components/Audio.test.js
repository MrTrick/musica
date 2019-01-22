import React from 'react';
import ReactDOM from 'react-dom';
import Audio from './Audio';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Audio
    isPlaying={false}
    handleProgress={()=>{}}
    handleTrackEnd={()=>{}}
  />, div);
  ReactDOM.unmountComponentAtNode(div);
});

//TODO more tests
