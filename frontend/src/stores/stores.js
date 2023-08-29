import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import thunk from "redux-thunk";
import taskReducer from "../reducers/taskReducer";
import templateReducer from "../reducers/templateReducer";

const rootReducer = combineReducers({
  tasks: taskReducer,
  templates: templateReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
