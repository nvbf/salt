import React from "react";
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';

const styles = {

}

class StepEmailReceipt extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            emailAddress: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.onSetReceiptEmail = this.onSetReceiptEmail.bind(this);
    }

    handleChange(event) {
        // de not set state on defaultValue
        if (event.target.value == " ") {
            return;
        }
        this.setState({ emailAddress: event.target.value });
    }

    onSetReceiptEmail() {
        this.props.onSetReceiptEmail(this.state.emailAddress);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        prevState.emailAddress = nextProps.receiptEmail;
        return prevState;
    }

    render()
    {

        const {
            classes,
            onGoBack
        } = this.props;

        const { emailAddress } = this.state;

        return (
            <div>
                <Typography>
                        <TextField
                            id="name"
                            label="Mottaker Epost"
                            value={this.state.emailAddress}
                            onChange={this.handleChange}
                            margin="normal"
                            type="email"
                        />
                </Typography>
                <div className={classes.actionsContainer}>
                    <div>
                        <Button
                            disabled={false}
                            onClick={onGoBack}
                            className={classes.button}
                        >
                            Tilbake
                        </Button>
                        <Button
                            disabled={false}
                            variant="raised"
                            color="primary"
                            onClick={this.onSetReceiptEmail}
                            className={classes.button}
                        >
                            Neste
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}


export default withStyles(styles)(StepEmailReceipt);
