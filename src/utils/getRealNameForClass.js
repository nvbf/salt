import debug from "debug";
const log = debug("getRealNameForClass");

export function getRealNameForClass(tournamentClassShortName) {
  const realName = mapping[tournamentClassShortName];
  if (!realName) {
    log(`getRealNameForClass: No mapping for ${tournamentClassShortName}`);
    return "";
  }
  return realName;
}

const mapping = {
  M: "Menn",
  K: "Kvinner",
  GU21: "Gutter under 21",
  GU19: "Gutter under 19",
  GU17: "Gutter under 17",
  GU15: "Gutter under 15",
  JU21: "Jenter under 21",
  JU19: "Jenter under 19",
  JU17: "Jenter under 17",
  JU15: "Jenter under 15"
};
