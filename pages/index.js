import React from "react";
import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";

export default () => (
  <div>
    <Head title="Home" />
    <Nav />

    <div className="hero">
      <h1 className="title">Første utkast !</h1>
      <p className="description">
        Her vil du fine turneringer, ranking seeding osv, og alt blir automatisk
        oppdattert.
      </p>

      <div className="row">
        <Link href="/ranking">
          <a className="card">
            <h3>Rankinglista &rarr;</h3>
            <p>Se rankinglista!</p>
          </a>
        </Link>
        <Link href="/tournaments">
          <a className="card">
            <h3>Turneringer &rarr;</h3>
            <p>Se årets turneringer og meld deg på </p>
          </a>
        </Link>
        <Link href="/players">
          <a className="card">
            <h3>Resultater &rarr;</h3>
            <p>Se resultater fra de siste turneringene som har vært</p>
            <p>OBS denne funker ikke enda!!</p>
          </a>
        </Link>
      </div>
    </div>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
      .row {
        max-width: 880px;
        margin: 80px auto 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .card {
        padding: 18px 18px 24px;
        width: 220px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9b9b9b;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card h3 {
        margin: 0;
        color: #067df7;
        font-size: 18px;
      }
      .card p {
        margin: 0;
        padding: 12px 0 0;
        font-size: 13px;
        color: #333;
      }
    `}</style>
  </div>
);
