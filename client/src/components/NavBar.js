import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

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
  const {classes, handleSearch, filter} = props;

  return (<AppBar position="static">
    <Toolbar>
      <Logo/>
      <div className={classes.grow} />
      <InputSearch
        value={filter}
        handleChange={handleSearch}
      />
    </Toolbar>
  </AppBar>);
}

NavBar.propTypes = {
  filter: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired
};


export default withStyles(styles)(NavBar);
