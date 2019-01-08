import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';

import DurationIcon from '@material-ui/icons/AvTimer';

import {hhmmss} from './helpers';

// function ListItemLink(props) {
//   return <ListItem button component="a" {...props} />;
// }

function Tracks(props) {
  const { tracks } = props;
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell><DurationIcon fontSize="inherit" aria-label="Duration" /></TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>Album</TableCell>
            <TableCell>...</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tracks.map((track) => {
            return (
              <TableRow key={track.id}>
                <TableCell component="th" scope="row">
                  {track.title||'Untitled'}
                </TableCell>
                <TableCell>{hhmmss(track.format.duration)}</TableCell>
                <TableCell>
                  {track.artist}
                  {track.albumartist && track.albumartist !== track.artist && (
                    <Typography style={{display:'inline'}} color="textSecondary"> - {track.albumartist}</Typography>
                  )}
                </TableCell>
                <TableCell>{track.album}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

Tracks.propTypes = {
  tracks: PropTypes.array.isRequired,
};

//TODO: Remove these placeholder values
/*TrackList.defaultProps = {
};*/

export default Tracks;
