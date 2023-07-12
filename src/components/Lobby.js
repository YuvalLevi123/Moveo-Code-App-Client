import { React, useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import "./Lobby.css";

function Lobby({ codeBlocks }) {
  const [showAlert, setShowAlert] = useState(false);

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
      .then((data) => {
        console.log(data);
        setShowAlert(true); // Show the alert
        //setTimeout(() => setShowAlert(false), 4000);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  console.log(codeBlocks);
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="text-center">
        <h1 className="mb-4 title">Choose code block</h1>
        {showAlert && (
          <Alert
            variant="success"
            onClose={() => setShowAlert(false)}
            dismissible
          >
            <Alert.Heading>Well done!</Alert.Heading>
            <p>You successfully reset the Database</p>
            {/* <Alert.Link href="#">this important alert message</Alert.Link>. */}
          </Alert>
        )}
        {codeBlocks.map((block) => (
          <Card
            key={block.id}
            className="mb-2 card-custom"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <Card.Body>
              <Card.Text>
                <Link className="text-light" to={`/code/${block.id}`}>
                  {block.title}
                </Link>
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
        <Button variant="danger" onClick={handleClick}>
          RESET
        </Button>
      </div>
    </div>
  );
}

export default Lobby;

// {
//   /* <div class="d-grid gap-2">
// <button class="btn btn-lg btn-primary" type="button">Block button</button>
// <button class="btn btn-lg btn-primary" type="button">Block button</button>
// </div> */
// }
