import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";
import WithErrorHandler from "./services/withErrorHandler";
import ErrorBoundary from "./services/errorBoundry";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <WithErrorHandler />
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Provider>
);
reportWebVitals();
