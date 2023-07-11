import React from "react";
import { Link } from "react-router-dom";

function Lobby({ codeBlocks }) {
  const handleClick = () => {
    fetch(
      //"http://localhost:3001/api/reset",
      "https://moveo-code-app-server-081d43b8aa05.herokuapp.com/api/reset",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  console.log(codeBlocks);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "50vh",
      }}
    >
      <h1>Choose code block</h1>
      {codeBlocks.map((block) => (
        <div key={block.id}>
          <Link to={`/code/${block.id}`}>{block.title}</Link>
        </div>
      ))}
      <div>
        <button onClick={handleClick}>RESET</button>
      </div>
    </div>
  );
}

export default Lobby;
