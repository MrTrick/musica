import React, { Component } from 'react';
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

class Row extends Component{
  constructor(props) {
    super(props);
    this.handleClickTrack = this.handleClickTrack.bind(this);
  }

  handleClickTrack(event) {
    event.preventDefault();
    const { isCurrent, track, handlePlayTrack, handleSelectTrack } = this.props;
    if (isCurrent) {
      handlePlayTrack && handlePlayTrack(track);
    } else {
      handleSelectTrack && handleSelectTrack(track);
    }
  }

  matchesFilter(track, filter) {
    if (!filter || (typeof filter !== 'string')) {
      return true;
    } else {
      const _filter = filter.toLowerCase();
      const fields = ['title', 'album', 'genre', 'artist', 'albumartist'];

      return fields.find((f) => {
        var v = track[f];
        if (Array.isArray(v)) [v] = v;
        return (typeof v == 'string') && v.toLowerCase().includes(_filter);
      });
    }
  }

  render() {
    const { classes, track, isCurrent, filter } = this.props;
    const rowClasses = isCurrent ? `${classes.root} ${classes.current}` : classes.root;

    if (!this.matchesFilter(track, filter)) return null;

    return (
      <TableRow hover={true} className={rowClasses} onClick={this.handleClickTrack}>
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
}

Row.propTypes = {
  track: PropTypes.object.isRequired,
  isCurrent: PropTypes.bool.isRequired,
  filter: PropTypes.string,
  handleSelectTrack: PropTypes.func.isRequired,
  handlePlayTrack: PropTypes.func.isRequired
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

class Tracks extends Component {
  render() {
    const { classes, tracks, current, filter, handleSelectTrack, handlePlayTrack } = this.props;

    return (
      <Paper className={classes.root}>
        <Table>
          <StyledHead/>
          <TableBody>
            {tracks.map((track) => (<StyledRow
              track={track}
              filter={filter}
              isCurrent={current.id === track.id}
              handleSelectTrack={handleSelectTrack}
              handlePlayTrack={handlePlayTrack}
              key={track.id}
            />))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

Tracks.propTypes = {
  tracks: PropTypes.array.isRequired,
  current: PropTypes.object.isRequired,
  filter: PropTypes.string,
  handleSelectTrack: PropTypes.func.isRequired,
  handlePlayTrack: PropTypes.func.isRequired
};

export default withStyles(styles)(Tracks);
