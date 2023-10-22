// reducers/destinationReducer.js

const initialState = {
  affectations: affectation,
};

const destinationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_AFFECTATION_VISIBILITY':
      const { affectationName, visibility } = action.payload;
      const updatedAffectations = state.affectations.map((affectation) => {
        if (affectation.name === affectationName) {
          return { ...affectation, visibleState: visibility };
        }
        return affectation;
      });
      return { ...state, affectations: updatedAffectations };
    default:
      return state;
  }
};

export default destinationReducer;
