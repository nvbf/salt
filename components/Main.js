import Head from "./head";
import Nav from "./nav";
import Content from "./content"

export default class Main extends React.Component {

    render() {
        return (
            <div>
                <Head title="Home" />
                <Nav />
                <Content>
                    {this.props.children}
                </Content>
            </div>
        );
    }
}