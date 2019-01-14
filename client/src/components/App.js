import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NavBar from './NavBar';
import Loading from './Loading';
import Tracks from './Tracks';
import PlayerBar from './PlayerBar';
import Audio from './Audio';

import unboundActions from '../actions.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.actions = bindActionCreators(unboundActions, props.dispatch);
  }

  loadTracks = async() => {
    const response = await fetch('musica');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  componentDidMount() {
    const actions = this.actions;

    actions.loadTracks();
    this.loadTracks()
       .then((tracks)=>actions.loadedTracks(tracks))
       .catch(err => console.log(err));
  };

  render() {
    const { isLoading, isLoaded, isPlaying, tracks, current, progress, filter } = this.props;
    const actions = this.actions;

    return (<>
      <NavBar
        filter={filter}
        handleSearch={actions.search}
      />
      {isLoading && (<Loading/>)}
      {isLoaded && (<Tracks
        tracks={tracks}
        current={current}
        filter={filter}
        handleSelectTrack={actions.selectTrack}
        handlePlayTrack={actions.playTrack}
      />)}
      <PlayerBar
        current={current}
        isPlaying={isPlaying}
        progress={progress}
        handlePlay={actions.play}
        handlePause={actions.pause}
        handlePrev={actions.prev}
        handleNext={actions.next}
      />
      <Audio
        current={current}
        isPlaying={isPlaying}
        handleTrackEnd={actions.next}
        handleProgress={actions.progress}
      />
    </>);
  }
}

export default connect(state=>state)(App);
