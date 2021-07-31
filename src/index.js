import React from "react";
import ReactDOM from "react-dom";
import Connection from "./components/Connection";

const App = () => {
  return (
    <div>
      <Connection />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
