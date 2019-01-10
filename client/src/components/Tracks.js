import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DurationIcon from '@material-ui/icons/AvTimer';

import {hhmmss} from '../helpers';

//------------------------------------------------------------------------------
const headStyles = (theme) => ({
    root: {
      borderBottom:`0.15em ${theme.palette.secondary.main} solid`
    },
    row: {
      height: '40px'
    },
    cell: {
      fontSize: '1rem',
      color: theme.palette.text.primary
    }
});

function Head(props) {
  const { classes } = props;

  return (<TableHead className={classes.root}>
    <TableRow className={classes.row}>
      <TableCell className={classes.cell}>Title</TableCell>
      <TableCell className={classes.cell}>Artist</TableCell>
      <TableCell className={classes.cell}><DurationIcon fontSize="small" aria-label="Duration" /></TableCell>
      <TableCell className={classes.cell}>Album</TableCell>
      <TableCell className={classes.cell}>Genre</TableCell>
    </TableRow>
  </TableHead>);
}

Head.propTypes = {

};

const StyledHead = withStyles(headStyles)(Head);


//------------------------------------------------------------------------------
const rowStyles = (theme) => ({
  root: {
    cursor: 'pointer'
  },
  current: {
    backgroundColor: theme.palette.type === 'light'
          ? 'rgba(0, 0, 0, 0.14)'
          : 'rgba(255, 255, 255, 0.20)',
  }
});

function Row(props) {
  const { classes, track, isCurrent } = props;
  const rowClasses = isCurrent ? [classes.root, classes.current] : [classes.root];

  return (
    <TableRow hover={true} className={rowClasses}>
      <TableCell component="th" scope="row">
        {track.title||'Untitled'}
      </TableCell>
      <TableCell>
        {track.artist}
        {track.albumartist && track.albumartist !== track.artist && (
          <Typography style={{display:'inline'}} color="textSecondary"> - {track.albumartist}</Typography>
        )}
      </TableCell>
      <TableCell>
        {hhmmss(track.format.duration)}
      </TableCell>
      <TableCell>
        {track.album}
      </TableCell>
      <TableCell>
        {track.genre}
      </TableCell>
    </TableRow>
  );
}

Row.propTypes = {
  track: PropTypes.object.isRequired
};

const StyledRow = withStyles(rowStyles)(Row);

//------------------------------------------------------------------------------
const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 1,
    marginBottom: '5em'
  }
});

function Tracks(props) {
  const { classes, tracks, current } = props;
  return (
    <Paper className={classes.root}>
      <Table>
        <StyledHead/>
        <TableBody>
          {tracks.map((track) => (<StyledRow
            track={track}
            isCurrent={current.id === track.id}
            key={track.id}
          />))}
        </TableBody>
      </Table>
    </Paper>
  );
}

Tracks.propTypes = {
  tracks: PropTypes.array.isRequired,
  current: PropTypes.object.isRequired
};

export default withStyles(styles)(Tracks);
