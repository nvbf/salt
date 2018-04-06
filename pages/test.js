import React from "react";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export default class extends React.Component {
  render() {
    return <p>P: {publicRuntimeConfig.BT_MERCHANT_ID} </p>;
  }
}
