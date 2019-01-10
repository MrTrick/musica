import React, { Component } from 'react';
import { connect } from 'react-redux'

import NavBar from './NavBar';
import Loading from './Loading';
import Tracks from './Tracks';
import PlayerBar from './PlayerBar';
import Audio from './Audio';

import { actionLoadedTracks }  from '../reducers.js';

class App extends Component {
  loadTracks = async() => {
    const response = await fetch('/musica');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  componentDidMount() {
    this.loadTracks()
       .then(tracks => this.props.dispatch(actionLoadedTracks(tracks)))
       .catch(err => console.log(err));
  };

  render() {
    const { isLoading, isLoaded, tracks, current } = this.props;

    return (<>
      <NavBar/>
      {isLoading && (<Loading/>)}
      {isLoaded && (<Tracks tracks={tracks} current={current} />)}
      <PlayerBar current={current} />
      <Audio />
    </>);
  }
}

/*function mapStateToProps(state) {
  const { isLoading, isLoaded } = state;
  return { isLoading, isLoaded };
}*/
export default connect(state=>state)(App);
