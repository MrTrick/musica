import React from 'react';
import ReactDOM from 'react-dom';
import Tracks from './Tracks';
import { fakeTrack } from '../testutils';

it('tests the faker generator', () => {
  const track = fakeTrack();
  expect(Object.keys(track)).toEqual(expect.arrayContaining([
    'id','artist','artists','title','album','created','track','year','genre','format','src'
  ]));
  expect(track.format).toHaveProperty('duration');
  
  const track2 = fakeTrack({artist:'TESTSTRING'});
  expect(track2.artist).toBe('TESTSTRING');
  const track3 = fakeTrack({newfield:'NEWFIELD'});
  expect(track3.newfield).toBe('NEWFIELD');

  const track4 = fakeTrack({src:undefined});
  expect(track4).not.toHaveProperty('src');
});


it('renders without crashing', () => {
  const tracks = Array(5).fill().map(()=>fakeTrack());

  const div = document.createElement('div');
  ReactDOM.render(<Tracks
    tracks={tracks}
    current={tracks[0]}
    handleSelectTrack={()=>{}}
    handlePlayTrack={()=>{}}
  />, div);
  ReactDOM.unmountComponentAtNode(div);
});

//TODO more tests
