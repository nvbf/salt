import Head from "./head";
import Nav from "./nav";
import Content from "./content"
import CssBaseline from 'material-ui/CssBaseline';

import orange from 'material-ui/colors/orange';
import blue from 'material-ui/colors/blue';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

const theme = createMuiTheme({
    palette: {
        primary: orange,
        secondary: blue
    },
});

export default class Main extends React.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
        const jssStyles = document.getElementById('jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <div>
                    <Head title="Home" />
                    <Nav />
                    <Content>
                        {this.props.children}
                    </Content>
                </div>
            </MuiThemeProvider>
        );
    }
}
