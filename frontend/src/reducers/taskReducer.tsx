import { FETCH_TASKS } from "../actions/actionType";

const initialState = {
  tasks: [],
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };

    default:
      return state;
  }
};

export default taskReducer;
