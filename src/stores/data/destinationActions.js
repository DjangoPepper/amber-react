// actions/destinationActions.js

export const updateAffectationVisibility = (affectationName, visibility) => {
  return {
    type: 'UPDATE_AFFECTATION_VISIBILITY',
    payload: {
      affectationName,
      visibility,
    },
  };
};
