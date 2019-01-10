import { createAction, createReducer } from 'redux-act';

export const defaultState = {
  isLoading: false,
  isLoaded: false,
  isPlaying: false,

  tracks: [],
  current: null,
  index: 0
};

//export const doLoadIndex = createAction('doLoadIndex'); needed?
// export const doPlay = createAction('doPlay');
// export const doPause = createAction('doPause');
// export const doNext = createAction('doNext');
// export const doPrev = createAction('doPrev');
// export const doSeek = createAction('doSeek');

export const actionLoadedTracks = createAction('actionLoadedTracks');
// export const actoinPlay = createAction('onPlay');
// export const onStop = createAction('onStop');
// export const onEnd = createAction('onEnd');
// export const onProgress = createAction('onProgress');

export default createReducer(
  {
    //Finished loading the track information - update the store.
    [actionLoadedTracks]: (state, tracks) => ({
      ...state,
      isLoading: false,
      isLoaded: true,
      tracks: tracks,
      current: tracks[0], //Go to the first track
      index: 0
    })
  },
  defaultState
);
/*
export default createReducer({
  [increment]: (state) => state + 1,
  [decrement]: (state) => state - 1
}, 0);



export default createReducer({
  [increment]: (state) => state + 1,
  [decrement]: (state) => state - 1
}, 0);


volume: PropTypes.number,
onEnd: PropTypes.func,
onPause: PropTypes.func,
onPlay: PropTypes.func,
onVolume: PropTypes.func,
onStop: PropTypes.func,
onLoad: PropTypes.func,
onLoadError: PropTypes.func,
html5: PropTypes.bool
}


state = {
  loaded: false,
  tracks: [],
  current: null,
  index: 0,
  playing: false,
};

import React from 'react'
import ReactHowler from 'ReactHowler'
import raf from 'raf' // requestAnimationFrame polyfill
import Button from '../components/Button'

class FullControl extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      playing: false,
      loaded: false,
      loop: false,
      mute: false,
      volume: 1.0
    }
    this.handleToggle = this.handleToggle.bind(this)
    this.handleOnLoad = this.handleOnLoad.bind(this)
    this.handleOnEnd = this.handleOnEnd.bind(this)
    this.handleOnPlay = this.handleOnPlay.bind(this)
    this.handleStop = this.handleStop.bind(this)
    this.renderSeekPos = this.renderSeekPos.bind(this)
    this.handleLoopToggle = this.handleLoopToggle.bind(this)
    this.handleMuteToggle = this.handleMuteToggle.bind(this)
  }

  componentWillUnmount () {
    this.clearRAF()
  }

  handleToggle () {
    this.setState({
      playing: !this.state.playing
    })
  }

  handleOnLoad () {
    this.setState({
      loaded: true,
      duration: this.player.duration()
    })
  }

  handleOnPlay () {
    this.setState({
      playing: true
    })
    this.renderSeekPos()
  }

  handleOnEnd () {
    this.setState({
      playing: false
    })
    this.clearRAF()
  }

  handleStop () {
    this.player.stop()
    this.setState({
      playing: false // Need to update our local state so we don't immediately invoke autoplay
    })
    this.renderSeekPos()
  }

  handleLoopToggle () {
    this.setState({
      loop: !this.state.loop
    })
  }

  handleMuteToggle () {
    this.setState({
      mute: !this.state.mute
    })
  }

  renderSeekPos () {
    this.setState({
      seek: this.player.seek()
    })
    if (this.state.playing) {
      this._raf = raf(this.renderSeekPos)
    }
  }

  clearRAF () {
    raf.cancel(this._raf)
  }

  render () {
    return (
      <div className='full-control'>
        <ReactHowler
          src={['sound.ogg', 'sound.mp3']}
          playing={this.state.playing}
          onLoad={this.handleOnLoad}
          onPlay={this.handleOnPlay}
          onEnd={this.handleOnEnd}
          loop={this.state.loop}
          mute={this.state.mute}
          volume={this.state.volume}
          ref={(ref) => (this.player = ref)}
        />

        <p>{(this.state.loaded) ? 'Loaded' : 'Loading'}</p>

        <div className='toggles'>
          <label>
            Loop:
            <input
              type='checkbox'
              checked={this.state.loop}
              onChange={this.handleLoopToggle}
            />
          </label>
          <label>
            Mute:
            <input
              type='checkbox'
              checked={this.state.mute}
              onChange={this.handleMuteToggle}
            />
          </label>
        </div>

        <p>
          {'Status: '}
          {(this.state.seek !== undefined) ? this.state.seek.toFixed(2) : '0.00'}
          {' / '}
          {(this.state.duration) ? this.state.duration.toFixed(2) : 'NaN'}
        </p>

        <div className='volume'>
          <label>
            Volume:
            <span className='slider-container'>
              <input
                type='range'
                min='0'
                max='1'
                step='.05'
                value={this.state.volume}
                onChange={e => this.setState({volume: parseFloat(e.target.value)})}
                style={{verticalAlign: 'bottom'}}
              />
            </span>
            {this.state.volume.toFixed(2)}
          </label>
        </div>

        <Button onClick={this.handleToggle}>
          {(this.state.playing) ? 'Pause' : 'Play'}
        </Button>
        <Button onClick={this.handleStop}>
          Stop
        </Button>
      </div>
    )
  }
}

export default FullControl
*/
