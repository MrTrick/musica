import React from 'react';
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

import {hhmmss} from './helpers';

const BigPlayIcon = function() {
  return (<PlayIcon style={{height:38,width:38}} />);
}
const BigPauseIcon = function() {
  return (<PauseIcon style={{height:38,width:38}} />);
}

class SimpleSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, label } = this.props;
    const { value } = this.state;

    return (<Slider
      classes={classes}
      value={value}
      aria-label={label}
      onChange={this.handleChange}
    />);
  }
}

SimpleSlider.propTypes = {
  classes: PropTypes.object.isRequired,
};

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

function Player(props) {
  const { classes, isPlaying, title, artist, album, position, length } = props;
  const progressLabel = isPlaying ? `${hhmmss(position)} / ${hhmmss(length)}` : '';
  const progressNumber = isPlaying ? Math.floor(100*position/length) : 0;

  const sliderClasses = {
    track: classes.sliderTrack,
    thumb: classes.sliderThumb
  };

  return (<Tooltip title={progressLabel} aria-label={progressLabel}>
    <AppBar position="fixed" className={classes.root}>
      <SimpleSlider classes={sliderClasses}
        value={progressNumber}
        aria-label="Progress"
      />
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
      </Toolbar>


    </AppBar>
  </Tooltip>);
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
  isPlaying: true,
  title: "The Sound of Silence",
  artist: "Simon & Garfunkel",
  album: "The Best of Simon & Garfunkel",
  position: 65,
  length: 187
};

export default withStyles(styles)(Player);
