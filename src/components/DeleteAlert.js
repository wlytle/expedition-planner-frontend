import React from "react";
import { Alert, Button } from "react-bootstrap";

const DeleteAlert = ({ show, item, deleteAction, closeAction }) => {
  console.log("show", show);
  return (
    <>
      <Alert show={show} variant="danger">
        <Alert.Heading>{`Are you sure you want to delete ${item}?`}</Alert.Heading>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => closeAction(false)} variant="outline-success">
            No!!! I've made a mistake!
          </Button>
          <Button onClick={deleteAction} variant="outline-danger">
            Yup! Get me outta here!
          </Button>
        </div>
      </Alert>
    </>
  );
};

export default DeleteAlert;
