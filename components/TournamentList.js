import React from "react";
import debug from "debug";
import {withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";


import {TournamentListItem} from "../components/TournamentListItem";

const log = debug("TournamentsList");

const styles = theme => ({
  tournamentTitle: {
    marginBottom: theme.spacing.unit * 2
  },
  tournamentPaper: theme.mixins.gutters({
    padding: theme.spacing.unit
  }),
  tournamentList: {
    listStyle: "none",
    padding: 0,
    margin: 0
  },
  tournamentListItem: {
    marginBottom: theme.spacing.unit
  },
  filtersContainer: {
    marginBottom: theme.spacing.unit*2
  },
  filterItem: {
    marginRight: theme.spacing.unit*2,
    marginBottom: theme.spacing.unit*2,
    display: 'inline-block'
  }
});

class TournamentList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showFilters: false,
      tournamentTypes: [],
      tournamentClasses: [],
      tournamentRegions: []
    }

    this.toggleViewFilters = this.toggleViewFilters.bind(this);
  }

  // Can't be in constructor due to server side rendering
  componentDidMount() {
    // Load filters:
    const filters = this.loadFilters();

    this.setState({
      tournamentTypes: filters.tournamentTypes || [],
      tournamentClasses: filters.tournamentClasses || [],
      tournamentRegions: filters.tournamentRegions || []
    });
  }

  loadFilters() {
    const filters = localStorage.getItem('tournamentFilters');
    if (filters) {
      return JSON.parse(filters);
    }
    return {};
  }

  resetFilters() {
    this.setState({
      tournamentTypes: [],
      tournamentClasses: [],
      tournamentRegions: []
    })
  }

  saveFilters() {
    const { tournamentTypes, classes, tournamentRegions } = this.state
    const filters = {
      tournamentTypes: tournamentTypes,
      tournamentClasses: tournamentClasses,
      tournamentRegions: tournamentRegions
    };

    localStorage.setItem('tournamentFilters', JSON.stringify(filters));
  }

  toggleViewFilters() {
    const  { showFilters } = this.state;
    this.setState({
      showFilters: !showFilters
    });
  }

  toggleFilter(filterName, type) {
    console.log(filterName);
    console.log(this.state);
    const filter = this.state[filterName];

    if (filter.length == 0) {
      filter.push(type);
    }
    else {
      const pos = filter.indexOf(type);
      if (pos >= 0) {
        filter.splice(pos, 1);
      }
      else {
        filter.push(type);
      }
    }

    let state = [];
    state[filterName] = filter;
    this.setState(state);

    this.saveFilters();
  }


  renderFilterByKey(stateKey, tournamentKey) {
    const { classes, tournaments } = this.props;

    const currentTypes = this.state[stateKey] || [];

    console.log(currentTypes);
    console.log(this.state);

    const toggleFilter = this.toggleFilter.bind(this);


    const allTypes = Object.keys( tournaments.reduce ( (all, tournament) => {
      all[tournament[tournamentKey]] = true;
      return all;
    }, {}));

    console.log(allTypes);
    return allTypes.map ( function (type, index) {
      const elmId = `${tournamentKey}_filter_${index}`;
      const checked = currentTypes.indexOf(type) >= 0 || currentTypes.length == 0;
      return <div className={classes.filterItem}>
        <input id={elmId} key={index} type="checkbox" checked={checked} onChange={e => {
          toggleFilter(stateKey, type)
        }} />
        <label htmlFor={elmId}>{type}</label>
      </div>
    });
  }

  renderFilters() {
    const {classes } = this.props;
    return <Card className={classes.filtersContainer}>
      <CardContent>
      <Typography variant="headline">Filter</Typography>
      {/*<Typography variant="subheading">Klasser</Typography>
      {
        this.renderClassesFilter()
      }
      */}
      <Typography variant="subheading">Turneringstype</Typography>
      {
        this.renderFilterByKey("tournamentTypes", "tournamentType")
      }
      <Typography variant="subheading">Region</Typography>
      {
        this.renderFilterByKey("tournamentRegions", "region")
      }
      </CardContent>
    </Card>
  }

  render() {
    const {classes, tournaments = []} = this.props;
    const { showFilters, tournamentTypes, tournamentRegions } = this.state;

    let numFilteredTournaments = 0;
    const filteredTournaments = tournaments.filter ( tournament => {
      if (tournamentTypes.length > 0) {
        if (tournamentTypes.indexOf(tournament.tournamentType) < 0) {
          numFilteredTournaments++;
          return false;
        }
      }
      if (tournamentRegions.length > 0) {
        if (tournamentRegions.indexOf(tournament.region) < 0) {
          numFilteredTournaments++;
          return false;
        }
      }
      return true;
    });

    return (
      <React.Fragment>
        <div style={{display: 'flex'}}>
        <Typography variant="display1" className={classes.tournamentTitle} style={{flex: 1}}>
          Turneringer
        </Typography>
          <IconButton color="primary" onClick={e => {
            this.toggleViewFilters()
          }}><Icon>filter_list</Icon></IconButton>
        </div>
        {showFilters && this.renderFilters()}
        <Paper className={classes.tournamentPaper}>
          <ul className={classes.tournamentList}>
            {filteredTournaments.map((tournament, index) => {
              const displayDivider = Boolean(index < tournaments.length - 1);
              return (
                <TournamentListItem
                  key={tournament.id}
                  data={Object.assign(
                    {},
                    tournament,
                    {index},
                    {displayDivider}
                  )}
                />
              );
            })}
          </ul>
        </Paper>
        {numFilteredTournaments > 0 && <p>{numFilteredTournaments} turneringer ble filtrert bort</p>}
      </React.Fragment>
    );
  }
}



const styledTournamentList = withStyles(styles)(TournamentList);
export {styledTournamentList as TournamentList};
