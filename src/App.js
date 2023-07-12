import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CodeBlock from "./components/CodeBlock.js";
import Lobby from "./components/Lobby.js";
import { getAllCodeBlocks } from "./api/codeBlocksAPI";
function App() {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    getAllCodeBlocks()
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
        <Route path="/code/:id" element={<CodeBlock />} />
      </Routes>
    </Router>
  );
}

export default App;
