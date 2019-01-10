import React from 'react';
import PropTypes from 'prop-types';
import ReactHowler from 'react-howler';

function Audio(props) {
  const { current, isPlaying, handleTrackEnd } = props;
  if (!current) return null;

  const src = current.src;

  return (<ReactHowler
    src={src}
    playing={isPlaying}
    onEnd={handleTrackEnd}
  />);
};

Audio.propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  current: PropTypes.object,
  handleTrackEnd: PropTypes.func.isRequired
};

export default Audio;
