import React from "react";
import { Step, StepLabel, StepContent} from 'material-ui/Stepper';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

const styles = {

}

class StepChooseClass extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            currentClass: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.onSetClass = this.onSetClass.bind(this);
    }

    handleChange(event) {
        // de not set state on defaultValue
        if (event.target.value == " ") {
            return;
        }
        this.setState({ currentClass: event.target.value });
    }

    onSetClass() {
        this.props.onSetClass(this.state.currentClass);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        prevState.currentClass = nextProps.currentClass;
        return prevState;
    }

    render()
    {
        const { classes, tournamentClasses } = this.props;

        const { currentClass } = this.state;

        console.log(tournamentClasses);

        return (
            <div>
                <Typography>

                        <InputLabel htmlFor="klasse">Klasse</InputLabel>
                        <Select
                            value={currentClass}
                            onChange={this.handleChange}
                            inputProps={{
                                name: 'klasse',
                                id: 'klasse',
                            }}
                        >
                            {listOptions(tournamentClasses)}
                        </Select>
                </Typography>
                <div className={classes.actionsContainer}>
                    <div>
                        <Button
                            disabled={true}
                            onClick={this.handleBack}
                            className={classes.button}
                        >
                            Tilbake
                        </Button>
                        <Button
                            disabled={!currentClass}
                            variant="raised"
                            color="primary"
                            onClick={this.onSetClass}
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


function listOptions(classes) {
    const classesAsOptions = classes.map(klass => {
        const klass1 = klass["class"];
        return (
            <MenuItem key={klass1} value={klass1}>{klass1}</MenuItem>
        );
    });
    return classesAsOptions;
}


export default withStyles(styles)(StepChooseClass);
