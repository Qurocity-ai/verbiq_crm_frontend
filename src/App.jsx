import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AllRoutes from "./routes/AllRoutes";
import { Provider } from "react-redux";
import { store } from "./Store/Store.js";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AllRoutes />
      </Router>
    </Provider>
  );
};

export default App;
