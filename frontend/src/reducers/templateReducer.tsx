import { FETCH_FORM, FETCH_TEMPLATE } from "../actions/actionType";
const initialState = {
  templates: [],
};

const templateReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TEMPLATE:
      return {
        ...state,
        templates: action.payload,
      };
    default:
      return state;
  }
};

export default templateReducer;
