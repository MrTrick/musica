import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Logo from './Logo';
import InputSearch from './InputSearch';

const styles = (theme) => ({
  grow: {
    flexGrow: 1,
  },
});

function NavBar(props) {
  const {classes} = props;

  return (<AppBar position="static">
    <Toolbar>
      <Logo/>
      <div className={classes.grow} />
      <InputSearch />
    </Toolbar>
  </AppBar>);
}

NavBar.propTypes = {};
//TODO: Add handler definitions, etc!

export default withStyles(styles)(NavBar);
