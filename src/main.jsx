import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
// import App from "./App/App";
import "./index.css";
import store from "./App/store";
import Loading from "./Components/Loading/Loading";
/**
 *  Capitalize first letter
 * @returns String with First letter capital
 */
String.prototype.cap = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
const AppComponent = lazy(() => import("./App/App"));
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<Loading />}>
        <AppComponent />
      </Suspense>
    </Provider>
  </React.StrictMode>
);
