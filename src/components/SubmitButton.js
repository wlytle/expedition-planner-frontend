import React from "react";
import { connect } from "react-redux";
import { Button, Spinner } from "react-bootstrap";

const SubmitButton = ({ fetching, btnTxt }) => {
  return (
    <>
      {!fetching ? (
        <Button className="submit-btn" variant="outline-success" type="submit">
          {btnTxt}
        </Button>
      ) : (
        <Button className="submit-btn" variant="outline-success" disabled>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Loading...
        </Button>
      )}
    </>
  );
};

export default connect((state) => ({ fetching: state.UserReducer.fetching }))(
  SubmitButton
);
