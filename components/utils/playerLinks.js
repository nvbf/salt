import Link from "next/link";

export const PlayerLink = ({ id, children }) => (
  <Link href={"/players"} as={`/players/${id}`}>
    {children}
  </Link>
);
