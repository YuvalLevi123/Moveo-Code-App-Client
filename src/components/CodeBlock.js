import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "./CodeBlock.css";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
function CodeBlock() {
  const { id } = useParams();
  const [codeBlock, setCodeBlock] = useState({});
  const [isSolved, setIsSolved] = useState(false);
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
    // if (!isStudent) {
    //   socket.current.on("codeUpdate", (updatedCodeBlock) => {
    //     if (updatedCodeBlock.id === id) {
    //       setCodeBlock(updatedCodeBlock);
    //     }
    //   });
    // }
    socket.current.on("codeUpdate", (updatedCodeBlock) => {
      if (updatedCodeBlock.id === id) {
        setCodeBlock(updatedCodeBlock);
        if (updatedCodeBlock.code === updatedCodeBlock.solution) {
          setIsSolved(true);
        } else {
          setIsSolved(false);
        }
      }
    });
    fetchData();
    return () => {
      socket.current.disconnect();
    };
  }, []); // Dependency array added

  const handleCodeChange = (updatedCode) => {
    const updatedCodeBlock = { ...codeBlock, code: updatedCode };
    setCodeBlock(updatedCodeBlock);

    if (updatedCode === codeBlock.solution) {
      setIsSolved(true);
    } else {
      setIsSolved(false);
    }
    // For students: Send updates
    if (isStudent) {
      socket.current.emit("codeUpdate", updatedCodeBlock);
    }
  };
  // options and props for AceEditor
  const editorOptions = {
    mode: "javascript",
    theme: "github",
    onChange: handleCodeChange,
    value: codeBlock.code || "",
    name: "UNIQUE_ID_OF_DIV",
    editorProps: { $blockScrolling: true },
    setOptions: { useWorker: false },
    readOnly: !isStudent,
  };
  return (
    <div className="code-block-container">
      <div className="code-block">
        {isSolved && (
          <div className="code-block-title solved-message">
            Perfect Solution😊
          </div>
        )}
        <h1 className="code-block-title">{codeBlock.title}</h1>
        {/* <textarea
          value={codeBlock.code || ""}
          onChange={(e) => handleCodeChange(e.target.value)}
          disabled={!isStudent}
          className={`code-block-textarea ${
            !isStudent ? "textarea-disabled" : ""
          }`}
        ></textarea> */}
        <div className="ace-editor-wrapper">
          <AceEditor
            style={{ height: "100%", width: "100%" }}
            className={!isStudent ? "ace-editor-disabled" : ""}
            {...editorOptions}
          />
        </div>
        <div className="user-role">
          You are currently viewing as:
          <span className="bold-text">
            {isStudent ? "Student (edit mode)" : "Mentor (read only mode)"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CodeBlock;
