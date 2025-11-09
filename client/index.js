import React from "react";
import reactDom from "react-dom/client";
import ".index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./app/store"; //ייבוא stor
import { Provider } from "react-redux";//יודעת להעביר הלאה

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider  store={store} >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
