import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "./CodeBlock.css";

function CodeBlock({ codeBlocks }) {
  const { id } = useParams();
  const [codeBlock, setCodeBlock] = useState(
    codeBlocks.find((block) => block.id === id)
  );
  const socket = useRef();
  const [isStudent, setIsStudent] = useState(false);
  //const isStudent = codeBlock.currentVisitors > 0 ? true : false;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          // `http://localhost:3001/api/codeblocks/${id}`
          `${process.env.REACT_APP_SERVER_URL}/api/codeblocks/${id}`
        );
        const data = await response.json();
        setCodeBlock(data);
        setIsStudent(data.currentVisitors > 0);
        const updatedData = { ...codeBlock, currentVisitors: 1 };
        const putResponse = await fetch(
          // `http://localhost:3001/api/codeblocks/${id}`,
          `${process.env.REACT_APP_SERVER_URL}/api/codeblocks/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          }
        );
        const updatedBlock = await putResponse.json();
        console.log("Data updated successfully:", updatedBlock);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    //socket.current = io("http://localhost:3001");
    socket.current = io(`${process.env.REACT_APP_SERVER_URL}`);

    // For non-students: Receive updates
    if (!isStudent) {
      socket.current.on("codeUpdate", (updatedCodeBlock) => {
        if (updatedCodeBlock.id === id) {
          setCodeBlock(updatedCodeBlock);
        }
      });
    }
    fetchData();
    return () => {
      socket.current.disconnect();
    };
  }, []); // Dependency array added

  const handleCodeChange = (updatedCode) => {
    const updatedCodeBlock = { ...codeBlock, code: updatedCode };
    setCodeBlock(updatedCodeBlock);

    // For students: Send updates
    if (isStudent) {
      socket.current.emit("codeUpdate", updatedCodeBlock);
    }
  };

  return (
    <div className="code-block-container">
      <div className="code-block">
        <h1 className="code-block-title">{codeBlock.title}</h1>
        <textarea
          value={codeBlock.code || ""}
          onChange={(e) => handleCodeChange(e.target.value)}
          disabled={!isStudent}
          className={`code-block-textarea ${
            !isStudent ? "textarea-disabled" : ""
          }`}
        ></textarea>
      </div>
    </div>
  );
}

export default CodeBlock;
