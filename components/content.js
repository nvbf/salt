import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    contentContainer: {
        marginRight: 'auto',
        marginLeft: 'auto',
        padding: theme.spacing.unit,
        [theme.breakpoints.up('md')]: {
            width: '960px',
        },
    }
});

class Content extends React.Component {

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.contentContainer}>
                {this.props.children}
            </div>
        )
    }
}

export default withStyles(styles)(Content);