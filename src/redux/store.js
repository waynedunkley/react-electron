import { createStore, compose, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import * as reducers from "./modules";

const reduxDevTools =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(
  combineReducers({
    ...reducers,
  }),
  compose(
    applyMiddleware(thunk),
    reduxDevTools,
  ),
);

export default store;
