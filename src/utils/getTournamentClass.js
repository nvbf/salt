export const getTournamentClass = (tournament, klasse) => {
  return tournament.classes.filter(klass => klass["klasse"] == klasse)[0];
};
