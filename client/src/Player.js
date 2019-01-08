import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPrevIcon from '@material-ui/icons/SkipPrevious';

import {hhmmss} from './helpers';

const BigPlayIcon = function() {
  return (<PlayIcon style={{height:38,width:38}} />);
}
const BigPauseIcon = function() {
  return (<PauseIcon style={{height:38,width:38}} />);
}


const Logo = function() {
  return (<Typography component="h3" variant="h3">MUSICA</Typography>);
};

class Player extends Component {
  render() {
    const { isPlaying, title, artist, album, position, length } = this.props;
    const progressLabel = isPlaying ? `${hhmmss(position)} / ${hhmmss(length)}` : '';
    const progressNumber = isPlaying ? Math.floor(100*position/length) : 0;

    return (<Tooltip title={progressLabel} aria-label={progressLabel}><AppBar position="sticky">
      <Toolbar>
        <IconButton aria-label="Previous Track"><SkipPrevIcon /></IconButton>
        <IconButton aria-label="Play/Pause">{isPlaying ? (<BigPauseIcon/>) : (<BigPlayIcon/>)}</IconButton>
        <IconButton aria-label="Next Track"><SkipNextIcon /></IconButton>

        <div style={{flexGrow:1}}>
          <Typography component="h5" variant="h5">{title}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {artist}
            {album && (<em> ({album})</em>)}
          </Typography>
        </div>
        <Logo />
      </Toolbar>
      <LinearProgress color="secondary" variant="determinate" value={progressNumber} />

    </AppBar></Tooltip>);
  }
}

Player.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  album: PropTypes.string,
  position: PropTypes.number,
  length: PropTypes.number.isRequired
}

//TODO: Remove these placeholder values
Player.defaultProps = {
  isPlaying: false,
  title: "The Sound of Silence",
  artist: "Simon & Garfunkel",
  album: "The Best of Simon & Garfunkel",
  position: 65,
  length: 187
};

export default Player;
