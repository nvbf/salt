function groupByGender(list) {
  return list.reduce(
    (groups, currentPlayer) => {
      if (currentPlayer.gender === "M") {
        groups.male.push(currentPlayer);
      } else {
        groups.female.push(currentPlayer);
      }
      return groups;
    },
    { male: [], female: [] }
  );
}

module.exports = {
  groupByGender
};
