import { createReducer } from 'redux-act';
import actions from './actions';

export const initialState = {
  isLoading: false,
  isLoaded: false,
  isPlaying: false,

  tracks: [],
  current: null,
  index: 0,
  progress: 0,
  filter: ''
};

export default createReducer(
  {
    [actions.loadTracks]: (state) => ({...state,
      isLoading: true,
      isLoaded: false
    }),

    [actions.loadedTracks]: (state, tracks) => ({...state,
      isLoading: false,
      isLoaded: true,
      tracks: tracks || [],
      current: tracks && tracks[0], //Go to the first track
      index: 0
    }),

    [actions.selectTrack]: (state, track) => ({...state,
      current: track,
      index: state.tracks.indexOf(track)
    }),

    [actions.playTrack]: (state, track) => ({...state,
      current: track,
      index: state.tracks.indexOf(track),
      isPlaying: true
    }),

    [actions.play]: (state) => ({...state,
      isPlaying: true
    }),

    [actions.pause]: (state) => ({...state,
      isPlaying: false
    }),

    [actions.next]: (state) => {
      const { index, tracks } = state;
      const next = Math.min(index + 1, tracks.length - 1);
      return {...state, index:next, current:tracks[next]};
    },

    [actions.prev]: (state) => {
      const { index, tracks } = state;
      const prev = Math.max(index - 1, 0);
      return {...state, index:prev, current:tracks[prev]};
    },

    [actions.progress]: (state, progress) => ({...state,
      progress
    }),

    [actions.search]: (state, filter) => ({...state,
      filter
    })
  },
  initialState
);
