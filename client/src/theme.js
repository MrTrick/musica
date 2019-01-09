import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import amber from '@material-ui/core/colors/amber';
import indigo from '@material-ui/core/colors/indigo';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  //type: 'dark',
  palette: {
    primary: { main: amber[700] },
    secondary: { main: indigo['A700'] }
  }
});

export default theme;
