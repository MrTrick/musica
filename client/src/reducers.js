import { createAction, createReducer } from 'redux-act';

export const initialState = {
  isLoading: false,
  isLoaded: false,
  isPlaying: false,

  tracks: [],
  current: null,
  index: 0,
  progress: 0
};

export const doLoadTracks = createAction('doLoadTracks');
export const didLoadTracks = createAction('didLoadTracks');

export const onSelectTrack = createAction('onSelectTrack');
export const onPlayTrack = createAction('onPlayTrack');

export const onPlay = createAction('onPlay');
export const onPause = createAction('onPause');
export const onPrev = createAction('onPrev');
export const onNext = createAction('onNext');

export const onProgress = createAction('onProgress');

export default createReducer(
  {
    [doLoadTracks]: (state) => ({...state,
      isLoading: true,
      isLoaded: false
    }),

    [didLoadTracks]: (state, tracks) => ({...state,
      isLoading: false,
      isLoaded: true,
      tracks: tracks,
      current: tracks[0], //Go to the first track
      index: 0
    }),

    [onSelectTrack]: (state, track) => ({...state,
      current: track,
      index: state.tracks.indexOf(track)
    }),

    [onPlayTrack]: (state, track) => ({...state,
      current: track,
      index: state.tracks.indexOf(track),
      isPlaying: true
    }),

    [onPlay]: (state) => ({...state,
      isPlaying: true
    }),

    [onPause]: (state) => ({...state,
      isPlaying: false
    }),

    [onNext]: (state) => {
      const { index, tracks } = state;
      const next = Math.min(index + 1, tracks.length - 1);
      return {...state, index:next, current:tracks[next]};
    },

    [onPrev]: (state) => {
      const { index, tracks } = state;
      const prev = Math.max(index - 1, 0);
      return {...state, index:prev, current:tracks[prev]};
    },

    [onProgress]: (state, progress) => ({...state,
      progress
    })
  },
  initialState
);
