import Link from "next/link";

export const PlayerLink = ({ id, children }) => (
  <Link href={"/players"} as={`/players/${id}`}>
    <a href={"/players"} >{children}</a>
  </Link>
);
