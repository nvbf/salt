export class ErrorPage extends React.Component {
  render() {
    return (
      <section>
        <h2>Error</h2>
        <p>
          Beklager, en feil har oppstått! Prøv igjen om litt, eller ring Sindre
          på 93008598 og klag!
        </p>
        <div>
          <h4>Detaljer</h4>
          <pre>{this.props.error}</pre>
        </div>
      </section>
    );
  }
}
