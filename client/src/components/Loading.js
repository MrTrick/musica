import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    padding: '2em'
  },
});

function Loading(props) {
  const {classes} = props;

  return (<div className={classes.root}>
    <CircularProgress size={80} />
  </div>);
}

export default withStyles(styles)(Loading);
