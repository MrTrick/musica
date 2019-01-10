import React from 'react';
import ReactDOM from 'react-dom';
import PlayerBar from './PlayerBar';
import { fakeTrack } from '../testutils';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PlayerBar
    current={fakeTrack()}
    isPlaying={false}
    progress={0}
    handlePlay={()=>{}}
    handlePause={()=>{}}
    handlePrev={()=>{}}
    handleNext={()=>{}}
  />, div);
  ReactDOM.unmountComponentAtNode(div);
});

//TODO more tests
