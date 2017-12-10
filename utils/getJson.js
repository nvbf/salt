export async function getJson(url) {
  const res = await fetch(url);
  const statusCode = res.statusCode > 200 ? res.statusCode : false;
  return await res.json();
}
