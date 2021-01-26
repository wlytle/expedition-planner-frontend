import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, Form, Container } from "react-bootstrap";
import { editTrip } from "../actions/TripActions";
import SubmitButton from "./SubmitButton";

const EditTripForm = ({ trip, editTrip, closeEdit }) => {
  const { id, name, start_date, end_date, completed, notes } = trip;
  const [tripName, setTripName] = useState(name);
  const [startDate, setStartDate] = useState(start_date.slice(0, 10));
  const [endDate, setEndDate] = useState(end_date.slice(0, 10));
  const [formNotes, setFormNotes] = useState(notes);
  const [markCompleted, setMarkCompleted] = useState(completed);

  const handleSubmit = (e) => {
    e.preventDefault();
    //EditTrip
    editTrip(tripName, startDate, endDate, formNotes, markCompleted, id);

    //open the trip detail page for this trip
    const curPane = document.getElementById(
      `list-group-trips-tabpane-#${trip.id}`
    );
    curPane.setAttribute("aria-hidden", false);
    curPane.className = "fade tab-pane active show";
    //close the edit form
    closeEdit();
  };

  //Record previous values
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  //record trip in form
  const prevTrip = usePrevious(trip);
  useEffect(() => {
    if (prevTrip === trip) return;
    setTripName(name);
    setStartDate(start_date.slice(0, 10));
    setEndDate(end_date.slice(0, 10));
    setFormNotes(notes);
    setMarkCompleted(completed);
  }, [completed, notes, end_date, start_date, name, prevTrip, trip]);

  return (
    <>
      <Container className="min-vh-100">
        <Row className="min-vh-100">
          <Col>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formEditTripName">
                    <Form.Label>Trip Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Trip Name"
                      value={tripName}
                      onChange={(e) => setTripName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formEditStartDate">
                    <Form.Label className="form-label">Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formEditEndDate">
                    <Form.Label className="form-label">End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Check
                    label="Completed"
                    type={"checkbox"}
                    checked={markCompleted}
                    onChange={() => setMarkCompleted(!markCompleted)}
                  />
                  <Form.Group controlId="ControlTextarea">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                    />
                  </Form.Group>
                  <SubmitButton btnTxt="Edit Trip" />
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default connect(null, { editTrip })(EditTripForm);
