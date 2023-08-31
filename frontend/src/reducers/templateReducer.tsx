// import { FETCH_FORM } from "../actions/actionType";
// const initialState = {
//   leftColumnComponents: [],
//   rightColumnComponents: [],
// };

// const templateReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case FETCH_FORM:
//       return {
//         ...state,
//         leftColumnComponents: action.payload.leftColumnComponents,
//         rightColumnComponents: action.payload.rightColumnComponents,
//       };
//     default:
//       return state;
//   }
// };

// export default templateReducer;

import { FETCH_FORM, FETCH_TEMPLATE } from "../actions/actionType";
const initialState = {
  // templates: [
  // [
  //   { type: "TextField", id: "1", name: "Judul" },
  //   { type: "TextField", id: "4", name: "Subjek" },
  // ],
  // [{ type: "SpinButton", id: "3", name: "Repetisi" }],
  // [
  //   { type: "DatePicker", id: "5", name: "Deadline" },
  //   { type: "TextField", id: "6", name: "Deskripsi" },
  // ],
  // ],
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
