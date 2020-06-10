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
        <section>
          <h4>Spiller 1</h4>
          <PlayerSelect
            players={players.filter(
              ({ playerId }) => playerId != (player2 ? player2.playerId : -1)
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
              ({ playerId }) => playerId != (player1 ? player1.playerId : -1)
            )}
            defaultItem={player2}
            placeHolder={"Finn Spiller 2"}
            onChange={this.onSetPlayer2}
          />
        </section>
        <p>
          Mangler det et navn?{" "}
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSeNXKDlzt4CBnbYOLv46plv4TTBwkxeyfDcq3ZxD0xYwImxoQ/viewform?usp=sf_link" target="_blank">Fyll ut dette skjemaet.</a>{" "}
        </p>
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
          <SearchInput
            fullWidth={true}
            classes={classes}
            InputProps={getInputProps({
              placeholder: placeHolder,
              id: "integration-downshift-simple",
              autoComplete: 'off'

            })}
           />
          {isOpen ? (
            <Paper square style={{maxHeight: '60vh', overflow: 'auto'}}>
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

function SearchInput(inputProps) {
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

  const searchWords = inputValue.toLowerCase().split(/\s+/);

  const result = players.filter(player => {
    const searchText = (player.firstname + " " + player.lastname).toLowerCase();
    for (const word of searchWords) {
      if (searchText.indexOf(word) === -1) {
        return false;
      }
    }

    return true;
  });

  return result.slice(0, 10);
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
      key={"" + suggestion.label + index}
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
