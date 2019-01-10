import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NavBar from './NavBar';
import Loading from './Loading';
import Tracks from './Tracks';
import PlayerBar from './PlayerBar';
import Audio from './Audio';

import * as unboundActions from '../reducers.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.actions = bindActionCreators(unboundActions, props.dispatch);
  }

  loadTracks = async() => {
    const response = await fetch('/musica');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  componentDidMount() {
    const { didLoadTracks } = this.actions;

    this.loadTracks()
       .then(didLoadTracks)
       .catch(err => console.log(err));
  };

  render() {
    const { isLoading, isLoaded, isPlaying, tracks, current } = this.props;
    const { onSelectTrack } = this.actions;

    return (<>
      <NavBar/>
      {isLoading && (<Loading/>)}
      {isLoaded && (<Tracks tracks={tracks} current={current} onSelectTrack={onSelectTrack}/>)}
      <PlayerBar current={current} isPlaying={isPlaying} />
      <Audio />
    </>);
  }
}

export default connect(state=>state)(App);
