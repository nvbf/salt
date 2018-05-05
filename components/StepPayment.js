import React from "react";
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import braintree from 'braintree-web-drop-in';
import BraintreeDropin from 'braintree-dropin-react';

const styles = {

}

const renderSubmitButton = ({onClick, isDisabled, text}) => {
    return (
        <Button
            variant="raised"
            color="primary"
            onClick={onClick}
            disabled={isDisabled}
        >{text}</Button>
    )
}

class StepPayment extends React.Component
{
    constructor(props) {
        super(props);

        this.onSignUp = this.onSignUp.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.handlePaymentMethod = this.handlePaymentMethod.bind(this);
    }

    onSignUp(event) {
        // de not set state on defaultValue
        this.props.onSignUp();
    }

    handlePaymentMethod(data) {
        console.log(this);
        this.props.onSignUp(data.nonce);
    }

    onCreate() {

    }

    render () {

        console.log(this.props);

        const {
            priceToPay,
            clientToken
        } = this.props;

        return (
            <div>
                <div>Pris: {priceToPay || 'Gratis'}</div>
                {priceToPay > 0 && <BraintreeDropin
                    braintree={braintree}
                    authorizationToken={clientToken}
                    handlePaymentMethod={this.handlePaymentMethod}
                    onCreate={this.onCreate}
                    onDestroyStart={this.onDestroyStart}
                    onDestroyEnd={this.onDestroyEnd}
                    onError={this.onError}
                    renderSubmitButton={renderSubmitButton}
                />}
                {priceToPay == 0 && <div>
                    <Button
                        variant="raised"
                        color="primary"
                        onClick={this.onSignUp}
                    >{text}</Button>
                </div>}
            </div>
        )
    }
}


export default withStyles(styles)(StepPayment);
