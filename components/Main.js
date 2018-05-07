import { Component, Fragment } from "react";
import Head from "./head";
import Nav from "./nav";
import { Error } from "./error";
import { Loading } from "./loading";
import Content from "./content";

export default class Main extends Component {
  render() {
    const content = this.getContent();
    return (
      <Fragment>
        <Head title="Home" />
        <Nav />
        <Content>{content}</Content>
      </Fragment>
    );
  }

  getContent() {
    const { error, errorDetails, loading, retryHandler } = this.props;

    if (error) {
      return <Error errorDetails={errorDetails} retryHandler={retryHandler} />;
    } else if (loading) {
      return <Loading />;
    }
    return this.props.children;
  }
}
