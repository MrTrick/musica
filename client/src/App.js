import React, { Component } from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from './theme';
import Player from './Player';
import Tracks from './Tracks';

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
      <Player />
      <Tracks tracks={metadata} />


    </MuiThemeProvider>);
  }
}
// <List>
//   {this.state.metadata.map((item,i)=>
//     <ListItem key={i}><a href={item.src.mp3}>
//       <ListItemText primary={(item.title||'untitled')} secondary={item.artist} />
//     </a></ListItem>
//   )}
// </List>

export default App;