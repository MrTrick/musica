import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Slider from '@material-ui/lab/Slider';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPrevIcon from '@material-ui/icons/SkipPrevious';

import {hhmmss} from '../helpers';

const BigPlayIcon = function() {
  return (<PlayIcon style={{height:38,width:38}} />);
}
const BigPauseIcon = function() {
  return (<PauseIcon style={{height:38,width:38}} />);
}

//------------------------------------------------------------------------------

const styles = (theme) => ({
  root: {
    top: 'auto',
    bottom: 0,
  },
  sliderTrack: {
    backgroundColor: theme.palette.secondary.main
  },
  sliderThumb: {
    backgroundColor: theme.palette.secondary.main
  }
});

class PlayerBar extends Component {
  render() {
    const { classes, current, isPlaying, progress } = this.props;
    const { title, artist, album, format } = current||{};
    const { duration } = format||{};

    const progressLabel = progress ? `${hhmmss(progress)} / ${hhmmss(duration)}` : '';
    const progressNumber = progress ? 100*progress/duration : 0;
    const sliderClasses = {
      track: classes.sliderTrack,
      thumb: classes.sliderThumb
    };

    const { handlePlay, handlePause, handlePrev, handleNext } = this.props;
    const noDefault = (f) => (e => { e.preventDefault(); f(); });

    return (<Tooltip title={progressLabel} aria-label={progressLabel}>
      <AppBar position="fixed" className={classes.root}>
        <Slider classes={sliderClasses}
          value={progressNumber}
          aria-label="Progress"
        />
        <Toolbar>
          <IconButton aria-label="Previous Track" onClick={noDefault(handlePrev)}><SkipPrevIcon /></IconButton>
          {isPlaying ? (
            <IconButton aria-label="Pause" onClick={noDefault(handlePause)}><BigPauseIcon/></IconButton>
          ) : (
            <IconButton aria-label="Play" onClick={noDefault(handlePlay)}><BigPlayIcon/></IconButton>
          )}
          <IconButton aria-label="Next Track" onClick={noDefault(handleNext)}><SkipNextIcon /></IconButton>

          <div style={{flexGrow:1}}>
            <Typography component="h5" variant="h5">{title}</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {artist}
              {album && (<em> ({album})</em>)}
            </Typography>
          </div>

          {isPlaying && (<Typography component="h6" variant="h6">{progressLabel}</Typography>)}
        </Toolbar>


      </AppBar>
    </Tooltip>);
  }
};

PlayerBar.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  current: PropTypes.object,
  progress: PropTypes.number,
  handlePlay: PropTypes.func.isRequired,
  handlePause: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

export default withStyles(styles)(PlayerBar);
