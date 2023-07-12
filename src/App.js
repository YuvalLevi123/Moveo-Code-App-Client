import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CodeBlock from "./components/CodeBlock.js";
import Lobby from "./components/Lobby.js";

function App() {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    fetch(
      //"http://localhost:3001/api/codeblocks"
      `${process.env.REACT_APP_SERVER_URL}/api/codeblocks`
    )
      .then((response) => response.json())
      .then((data) => {
        setCodeBlocks(data);
      })
      .catch((error) => {
        console.log("check");
        console.error("Error:", error);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lobby codeBlocks={codeBlocks} />} />
        <Route
          path="/code/:id"
          element={<CodeBlock codeBlocks={codeBlocks} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
