import React from "react";
import Head from "./head";
import Nav from "./nav";

export class ClassSelect extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
        <h3>Velg klasse du vil melde deg på i </h3>
        <select onChange={this.props.handleChange} id="class">
          {listOptions(this.props.classes)}
        </select>
      </React.Fragment>
    );
  }
}

function listOptions(classes) {
  const firstOption = <option key=" " value=" " />;

  const classesAsOptions = classes.map(klass => {
    const klass1 = klass["class"];
    return (
      <option key={klass1} value={klass1}>
        {klass1}
      </option>
    );
  });
  return [firstOption, ...classesAsOptions];
}
