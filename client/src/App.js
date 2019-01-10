import React, { Component } from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactHowler from 'react-howler';

import theme from './theme';
import NavBar from './NavBar';
import Tracks from './Tracks';
import Player from './Player';

import Button from '@material-ui/core/Button';

class App extends Component {
  state = {
    loaded: false,
    tracks: [],
    current: null,
    playing: false,
  };

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
      .then(tracks => {
        const current = tracks[0];
        this.setState({tracks, current, loaded: true});
      })
      .catch(err => console.log(err));
  };

  render() {
    const { loaded, tracks, current, playing } = this.state;

    return (<MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <NavBar/>
      {(loaded === false) ? (
        <CircularProgress/>
      ) : (<>
        <Button onClick={()=>this.setState({playing:true})}>PLAY</Button>
        <Button onClick={()=>this.setState({playing:false})}>PAUSE</Button>
        <Tracks tracks={tracks} />
        <ReactHowler
          src={[current.src.mp3, current.src.webm]}
          playing={playing}
        />
      </>)}
      <Player />
    </MuiThemeProvider>);
  }
}

export default App;
