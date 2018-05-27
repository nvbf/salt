export const getTournamentClass = (tournament, klasse) => {
  return tournament.classes.filter(klass => klass["class"] == klasse)[0];
};
