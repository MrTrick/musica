import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';

const styles = (theme) => ({
  root: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  icon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  clear: {
    width: theme.spacing.unit * 4,
    height: '100%',
    position: 'absolute',
    right: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
});

class InputSearch extends Component {
  constructor(props) {
    super(props);
    this.relayChange = this.relayChange.bind(this);
    this.clear = this.clear.bind(this);
  }

  relayChange(event) {
    event.preventDefault();
    const { handleChange } = this.props;
    handleChange && handleChange(event.target.value);
  }

  clear(event) {
    event.preventDefault();
    const { handleChange } = this.props;
    handleChange && handleChange('');
  }

  render() {
    const {classes, value } = this.props;
    return (<div className={classes.root}>
      <div className={classes.icon}>
        <SearchIcon />
      </div>
      {value &&
        <IconButton className={classes.clear} onClick={this.clear}>
          <ClearIcon />
        </IconButton>
      }
      <InputBase
        placeholder="Search…"
        value={value}
        onChange={this.relayChange}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
      />
    </div>);
  }
}

InputSearch.propTypes = {
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default withStyles(styles)(InputSearch);
