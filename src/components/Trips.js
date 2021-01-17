import React from "react";
import { connect } from "react-redux";
import { Tab, ListGroup, Col, Row } from "react-bootstrap";
import NewTripForm from "./NewTripForm";
import TripDetails from "./TripDetails";

const Trips = ({ allTrips }) => {
  return (
    <div>
      <Tab.Container id="list-group-trips" defaultActiveKey="#link1">
        <Row>
          <Col sm={4}>
            <ListGroup className="trip-list">
              <ListGroup.Item action href="#newTrip">
                New Trip
              </ListGroup.Item>
              {allTrips.map((trip) => {
                return (
                  <ListGroup.Item action key={trip.id} href={`#${trip.id}`}>
                    {" "}
                    {trip.name}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
          <Col sm={8}>
            <Tab.Content>
              <Tab.Pane eventKey="#newTrip">
                <NewTripForm />
              </Tab.Pane>
              {allTrips.map((trip) => {
                return (
                  <Tab.Pane key={trip.id} eventKey={`#${trip.id}`}>
                    <TripDetails trip={trip} />
                  </Tab.Pane>
                );
              })}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default connect((state) => ({ allTrips: state.TripReducer.allTrips }))(
  Trips
);
