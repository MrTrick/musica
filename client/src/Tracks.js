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

import {hhmmss} from './helpers';

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
  root: {}
});

function Row(props) {
  const { classes, track } = props;

  return (
    <TableRow hover={true} style={{cursor:'pointer'}} className={classes.root}>
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
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  }
});

function Tracks(props) {
  const { classes, tracks } = props;
  return (
    <Paper className={classes.root}>
      <Table>
        <StyledHead/>
        <TableBody>
          {tracks.map((track) => (<StyledRow track={track} key={track.id}/>))}
        </TableBody>
      </Table>
    </Paper>
  );
}

Tracks.propTypes = {
  tracks: PropTypes.array.isRequired,
};

export default withStyles(styles)(Tracks);
