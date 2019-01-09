import React, { Component } from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from './theme';
import NavBar from './NavBar';
import Tracks from './Tracks';
import Player from './Player';

class App extends Component {
  state = {
    metadata: []
  };

  getIndex = async() => {
    const response = await fetch('/musica');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
  };

  componentDidMount() {
    this.getIndex()
      .then(res => this.setState({ metadata: res }))
      .catch(err => console.log(err));
  };

  render() {
    const {metadata}=this.state;
    return (<MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <NavBar/>
      <Tracks tracks={metadata} />
      <Player />

    </MuiThemeProvider>);
  }
}

export default App;
