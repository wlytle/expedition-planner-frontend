import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { Tab, ListGroup, Col, Row } from "react-bootstrap";
import NewTripForm from "./NewTripForm";
import EditTripForm from "./EditTripForm";
import TripDetails from "./TripDetails";

//Render a list of alll a users trips with a pop up tab to show trip details
const Trips = ({ allTrips }) => {
  const formRef = useRef();
  const [selectedTrip, setSelectedTrip] = useState(false);

  //open Edit Form
  const triggerForm = (trip) => {
    formRef.current.setAttribute("aria-hidden", false);
    formRef.current.className = "fade tab-pane active show";
    console.log(trip);
    setSelectedTrip(trip);
  };
  //Close Edit Form
  const closeEdit = () => {
    if (formRef.current.getAttribute("aria-hidden")) {
      formRef.current.setAttribute("aria-hidden", true);
      formRef.current.className = "fade tab-pane";
    }
  };
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
                  <ListGroup.Item
                    action
                    key={trip.id}
                    href={`#${trip.id}`}
                    onClick={closeEdit}
                  >
                    {" "}
                    {trip.name}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
          <Col sm={8}>
            <Tab.Content>
              <Tab.Pane eventKey="#newTrip" ref={formRef}>
                <NewTripForm />
              </Tab.Pane>
              <Tab.Pane eventKey="#ediTrip" ref={formRef}>
                {selectedTrip ? (
                  <EditTripForm trip={selectedTrip} closeEdit={closeEdit} />
                ) : null}
              </Tab.Pane>
              {allTrips.map((trip) => {
                return (
                  <Tab.Pane key={trip.id} eventKey={`#${trip.id}`}>
                    <TripDetails trip={trip} edit={triggerForm} />
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
