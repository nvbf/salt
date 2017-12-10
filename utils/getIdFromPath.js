export function getIdFromPath() {
  const path = location.pathname.split("/");
  const id = path[path.length - 1];
  return id;
}
