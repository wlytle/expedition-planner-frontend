import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Col, Row, Container, Form, Card } from "react-bootstrap";
import { editLegMeta } from "../actions/TripActions";
import SubmitButton from "./SubmitButton";
import { sports } from "../constants";

const LegForm = ({ leg, editLegMeta }) => {
  const { start_date, end_date, sport, notes } = leg;
  const [startDate, setStartDate] = useState(start_date.slice(0, 10));
  const [endDate, setEndDate] = useState(end_date.slice(0, 10));
  const [formSport, setFormSport] = useState(sport);
  const [formNotes, setFormNotes] = useState(notes);

  const handleSubmit = (e) => {
    editLegMeta({
      id: leg.id,
      start_date: startDate,
      end_date: endDate,
      sport: formSport,
      notes: formNotes,
    });
  };

  const handleDelete = (e) => {
    console.log(e);
  };

  return (
    <section>
      <Container className="min-vh-100">
        <Row className="align-items-center min-vh-100">
          <Col>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
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

                  <Form.Group controlId="ControlSelect">
                    <Form.Label>Select Sport</Form.Label>
                    <Form.Control
                      as="select"
                      value={formSport}
                      onChange={(e) => setFormSport(e.target.value)}
                    >
                      {Object.keys(sports).map((sport) => (
                        <option key={sport}>{sport}</option>
                      ))}
                    </Form.Control>
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

                  <SubmitButton btnTxt={"Update Profile"} />
                  <Button
                    variant="outline-danger form-btn"
                    type="button"
                    onClick={handleDelete}
                  >
                    Delete Account
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default connect(null, { editLegMeta })(LegForm);
