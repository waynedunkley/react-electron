import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/store";
import "./index.css";

const rootEl = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootEl,
);

if (module.hot) {
  module.hot.accept("./App", () => {
    ReactDOM.render(<App />, document.getElementById("root"));
  });
}
