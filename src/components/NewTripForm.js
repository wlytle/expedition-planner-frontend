import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Row, Col, Card, Form, Container } from "react-bootstrap";
import { createTrip } from "../actions/TripActions";
import SubmitButton from "./SubmitButton";

const NewTripForm = ({ user, trip, createTrip }) => {
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    //create a new trip
    createTrip(tripName, startDate, endDate);
    history.push("/trip/" + trip.id);
  };

  return (
    <>
      <Container className="min-vh-100">
        <Row className="align-items-center min-vh-100">
          <Col>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicTripName">
                    <Form.Label>Trip Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Trip Name"
                      value={tripName}
                      onChange={(e) => setTripName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicStartDate">
                    <Form.Label className="form-label">StartDate</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicEndDate">
                    <Form.Label className="form-label">EndDate</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Form.Group>
                  <SubmitButton btnTxt="Create Trip" />
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.UserReducer.user,
    trip: state.TripReducer.trip,
  };
};

export default connect(mapStateToProps, {
  createTrip,
})(NewTripForm);
