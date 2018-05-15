import React from "react";
import Button from "material-ui/Button";
import { withStyles } from "material-ui/styles";
import braintree from "braintree-web-drop-in";
import BraintreeDropin from "braintree-dropin-react";

const styles = {};

const renderSubmitButton = (
  clickedOnPayment,
  { onClick, isDisabled, text }
) => {
  if (clickedOnPayment) {
    return;
  }
  return (
    <Button
      variant="raised"
      color="primary"
      onClick={onClick}
      disabled={isDisabled}
    >
      {text}
    </Button>
  );
};

class StepPayment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      paymentLoaded: false,
      clickedOnPayment: false
    };

    this.onSignUp = this.onSignUp.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onDestoryStart = this.onDestoryStart.bind(this);
    this.handlePaymentMethod = this.handlePaymentMethod.bind(this);
  }

  onSignUp(event) {
    // de not set state on defaultValue
    this.props.onSignUp();
  }

  handlePaymentMethod(data) {
    console.log(data);
    this.setState({ clickedOnPayment: true }, this.props.onSignUp(data.nonce));
  }

  onDestoryStart() {
    this.setState({
      paymentLoaded: false
    });
  }

  onCreate() {
    this.setState({
      paymentLoaded: true
    });
  }

  render() {
    const { paymentLoaded, clickedOnPayment } = this.state;

    const { priceToPay, clientToken } = this.props;

    return (
      <div>
        <div>Pris: {priceToPay || "Gratis"}</div>
        {priceToPay > 0 && (
          <BraintreeDropin
            braintree={braintree}
            authorizationToken={clientToken}
            handlePaymentMethod={this.handlePaymentMethod}
            onCreate={this.onCreate}
            onDestroyStart={this.onDestroyStart}
            onDestroyEnd={this.onDestroyEnd}
            onError={this.onError}
            renderSubmitButton={renderSubmitButton.bind(this, clickedOnPayment)}
          />
        )}
        {priceToPay > 0 && !paymentLoaded && <div>Loading payment...</div>}
        {priceToPay == 0 && (
          <div>
            <Button variant="raised" color="primary" onClick={this.onSignUp}>
              Bekreft Påmelding
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(StepPayment);
