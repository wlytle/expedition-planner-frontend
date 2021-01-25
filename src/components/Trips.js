import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { Tab, ListGroup, Col, Row } from "react-bootstrap";
import NewTripForm from "./NewTripForm";
import EditTripForm from "./EditTripForm";
import TripDetails from "./TripDetails";

//Render a list of alll a users trips with a pop up tab to show trip details
const Trips = ({ allTrips, invites }) => {
  const formRef = useRef();
  const [selectedTrip, setSelectedTrip] = useState(false);

  let location = useLocation();
  let history = useHistory();
  // set trips based on if we are on the profile page or the invitioans page
  let trips = location.pathname === "/profile" ? allTrips : invites;

  //open Edit Form
  const triggerForm = (trip) => {
    formRef.current.setAttribute("aria-hidden", false);
    formRef.current.className = "fade tab-pane active show";
    setSelectedTrip(trip);
  };
  //Close Edit Form
  const closeEdit = () => {
    if (formRef.current.getAttribute("aria-hidden")) {
      formRef.current.setAttribute("aria-hidden", true);
      formRef.current.className = "fade tab-pane";
    }
  };

  // open trip detail
  const openDetail = (id) => {
    const curPane = document.getElementById(`list-group-trips-tabpane-#${id}`);
    curPane.setAttribute("aria-hidden", false);
    curPane.className = "fade tab-pane active show";
  };

  useEffect(() => {
    // check if we hav ebeen directed here from the invites link and if so get the has value and open the correspodnign trip detail
    if (location?.pathname === "/invites" && location?.hash.length) {
      // Get selected invite id
      const id = location.hash.slice(1);
      invites.find((i) => i.id === id)
        ? openDetail(id)
        : history.push("/invites");
    }
  });

  return (
    <div>
      <Tab.Container id="list-group-trips" defaultActiveKey="#link1">
        <Row>
          <Col sm={4}>
            <ListGroup className="trip-list">
              {location.pathname === "/profile" ? (
                <ListGroup.Item action href="#newTrip">
                  New Trip
                </ListGroup.Item>
              ) : null}
              {trips.length ? (
                trips.map((trip) => {
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
                })
              ) : (
                <ListGroup.Item>
                  You don't have any invitations right now.
                </ListGroup.Item>
              )}
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
              {trips.map((trip) => {
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
const mapStateToProps = (state) => {
  return {
    allTrips: state.TripReducer.allTrips,
    invites: state.TripReducer.invites,
  };
};

export default connect(mapStateToProps)(Trips);
