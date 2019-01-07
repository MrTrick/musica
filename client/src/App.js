import React, { Component } from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import theme from './theme';
import PlayerBar from './PlayerBar';

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
    return (<MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <PlayerBar />
      <List>
        {this.state.metadata.map((item,i)=>
          <ListItem key={i}><a href={item.src.mp3}>
            <ListItemText primary={(item.title||'untitled')} secondary={item.artist} />
          </a></ListItem>
        )}
      </List>
    </MuiThemeProvider>);
  }
}


export default App;
