import Link from "next/link";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";

const links = [
  { href: "http://norgestour.no/", label: "norgestour.no" },
  {
    href: "https://www.profixio.com/fx/login.php?login_public=NVBF.NO.SVB",
    label: "Cupassist"
  }
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`;
  return link;
});

const Nav = () => (
  <nav>
    <AppBar position="static">
      <ul>
        <li>
          <Link prefetch href="/">
            <a>
              <Typography variant="title">Hjem</Typography>
            </a>
          </Link>
        </li>
        <ul>
          {links.map(({ key, href, label }) => (
            <li key={key}>
              <Link href={href}>
                <a>{label}</a>
              </Link>
            </li>
          ))}
        </ul>
      </ul>
    </AppBar>

    <style jsx>{`
      :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
          Helvetica, sans-serif;
      }
      nav {
        text-align: center;
      }
      ul {
        display: flex;
        justify-content: space-between;
      }
      nav > ul {
        padding: 4px 16px;
      }
      li {
        display: flex;
        padding: 6px 8px;
      }
      a {
        color: #067df7;
        text-decoration: none;
        font-size: 13px;
      }
    `}</style>
  </nav>
);

export default Nav;
