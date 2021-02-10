import React from "react";
import { connect } from "react-redux";
import { Button, Spinner } from "react-bootstrap";

const SubmitButton = ({
  fetching,
  btnTxt,
  variant = "outline-success",
  type = "submit",
  handleClick = false,
}) => {
  return (
    <>
      {!fetching ? (
        <Button
          className="form-btn"
          variant={variant}
          type={type}
          onClick={handleClick ? handleClick : null}
        >
          {btnTxt}
        </Button>
      ) : (
        <Button className="form-btn" variant={variant} disabled>
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
