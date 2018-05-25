import React from "react";

import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Downshift from "downshift";

const styles = {};

class StepChoosePlayers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      player1: null,
      player2: null
    };

    this.onSetPlayers = this.onSetPlayers.bind(this);
    this.onSetPlayer1 = this.onSetPlayer1.bind(this);
    this.onSetPlayer2 = this.onSetPlayer2.bind(this);
  }

  onSetPlayer1(player) {
    this.setState({
      player1: player
    });
  }

  onSetPlayer2(player) {
    this.setState({
      player2: player
    });
  }

  onSetPlayers() {
    const { player1, player2 } = this.state;

    this.props.onSetPlayers([player1, player2]);
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   prevState.player1 = nextProps.player1;
  //   prevState.player2 = nextProps.player2;
  //   return prevState;
  // }

  render() {
    const { onGoBack, players, classes } = this.props;

    const { player1, player2 } = this.state;

    return (
      <div>
        <Typography>
          <section>
            <h4>Spiller 1</h4>
            <PlayerSelect
              players={players.filter(
                ({ id }) => id != (player2 ? player2.id : -1)
              )}
              defaultItem={player1}
              placeHolder={"Finn Spiller 1"}
              onChange={this.onSetPlayer1}
            />
          </section>
          <section>
            <h4>Spiller 2</h4>
            <PlayerSelect
              players={players.filter(
                ({ id }) => id != (player1 ? player1.id : -1)
              )}
              defaultItem={player2}
              placeHolder={"Finn Spiller 2"}
              onChange={this.onSetPlayer2}
            />
          </section>
          <p>
            Mangler det et navn? Send mail til{" "}
            <a href="mailto:post@osvb.no">post@osvb.no</a>{" "}
          </p>
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
              disabled={!player1 || !player2}
              variant="raised"
              color="primary"
              onClick={this.onSetPlayers}
              className={classes.button}
            >
              Neste
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

function PlayerSelect({ players, placeHolder, defaultItem, onChange }) {
  const classes = {};
  return (
    <Downshift
      onChange={onChange}
      defaultSelectedItem={defaultItem}
      itemToString={item => (item ? `${item.firstname} ${item.lastname}` : "")}
    >
      {({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        selectedItem,
        highlightedIndex
      }) => (
        <div>
          {renderInput({
            fullWidth: true,
            classes,
            InputProps: getInputProps({
              placeholder: placeHolder,
              id: "integration-downshift-simple"
            })
          })}
          {isOpen ? (
            <Paper square>
              {getSuggestions(players, inputValue).map((suggestion, index) =>
                renderSuggestion({
                  suggestion,
                  index,
                  itemProps: getItemProps({ item: suggestion }),
                  highlightedIndex,
                  selectedItem
                })
              )}
            </Paper>
          ) : null}
        </div>
      )}
    </Downshift>
  );
}

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot
        },
        ...InputProps
      }}
      {...other}
    />
  );
}

function getSuggestions(players, inputValue) {
  let count = 0;

  const searchWords = inputValue.toLowerCase().split(/\s+/);

  return players.filter(player => {
    if (count > 5) {
      return false;
    }

    const searchText = (player.firstname + " " + player.lastname).toLowerCase();

    for (const word of searchWords) {
      if (searchText.indexOf(word) === -1) {
        return false;
      }
    }

    count++;
    return true;
  });
}

function renderSuggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem
}) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = selectedItem;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion.firstname} {suggestion.lastname}
    </MenuItem>
  );
}

export default withStyles(styles)(StepChoosePlayers);
