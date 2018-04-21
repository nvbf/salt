import Head from "./head";
import Nav from "./nav";

export class Main extends React.Component {
  render() {
    return (
      <div>
        <Head title="Home" />
        <Nav />
        {this.props.children}
      </div>
    );
  }
}
