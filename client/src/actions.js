import { createAction } from 'redux-act';

export default {
  loadTracks: createAction('loadTracks'),
  loadedTracks: createAction('loadTracks'),

  selectTrack: createAction('selectTrack'),
  playTrack: createAction('playTrack'),

  play:  createAction('play'),
  pause:  createAction('pause'),
  prev:  createAction('prev'),
  next:  createAction('next'),

  progress:  createAction('progress'),
  search:  createAction('search')
};
