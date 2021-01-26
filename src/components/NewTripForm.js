import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Row, Col, Card, Form, Container } from "react-bootstrap";
import { createTrip } from "../actions/TripActions";
import SubmitButton from "./SubmitButton";
import AsyncSearchBar from "./AsyncSearchBar";

const NewTripForm = ({ newId, createTrip }) => {
  const date = new Date();
  const today = date.toJSON().slice(0, 10);

  const [tripName, setTripName] = useState("");
  //Set default new trip start and end dats today
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [collabs, setCollabs] = useState("");
  const [formNotes, setFormNotes] = useState("");
  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    //create a new trip
    createTrip(tripName, startDate, endDate, formNotes, collabs);
  };

  useEffect(() => {
    if (newId) {
      history.push("/trip/" + newId);
    }
  });

  return (
    <>
      <Container className="min-vh-100">
        <Row className="min-vh-100">
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
                    <Form.Label className="form-label">Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={endDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicEndDate">
                    <Form.Label className="form-label">End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicCollaborators">
                    <Form.Label className="form-label">
                      Collaborators
                    </Form.Label>
                    <AsyncSearchBar setCollabs={setCollabs} collabs={collabs} />
                  </Form.Group>

                  <Form.Group controlId="ControlTextarea">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
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
    newId: state.TripReducer.newId,
  };
};

export default connect(mapStateToProps, {
  createTrip,
})(NewTripForm);
