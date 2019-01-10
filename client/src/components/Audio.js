import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactHowler from 'react-howler';
import requestInterval from 'request-interval';

class Audio extends Component {
  render() {
    const { current, isPlaying } = this.props;
    if (!current) return null;

    const src = current.src;

    const { handleTrackEnd, handleProgress } = this.props;

    var id = null;
    const onPlay = () => {
      id = requestInterval(100, ()=>handleProgress(this.player.seek()));
    };
    const onPause = () => {
      id && requestInterval.clear(id); id=null;
    };
    const onStop = () => {
      id && requestInterval.clear(id); id=null;
      handleProgress(0);
    };

    return (<ReactHowler
      src={src}
      playing={isPlaying}
      onEnd={handleTrackEnd}
      onPlay={onPlay} onPause={onPause} onStop={onStop}
      ref={(ref) => (this.player = ref)}
      html5={true}
    />);
  };
}

Audio.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  current: PropTypes.object,
  handleTrackEnd: PropTypes.func.isRequired,
  handleProgress: PropTypes.func.isRequired
};

export default Audio;
