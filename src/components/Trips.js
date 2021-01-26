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
  const newRef = useRef();
  const [selectedTrip, setSelectedTrip] = useState(false);
  const [displayId, setDisplayId] = useState(null);

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
  const closeEdit = (id) => {
    //set the id of the currently displayed trip
    if (formRef.current.getAttribute("aria-hidden")) {
      formRef.current.setAttribute("aria-hidden", true);
      formRef.current.className = "fade tab-pane";
    }
  };

  //close the new trip form
  const closeNew = () => {
    const id = location.hash.slice(1);
    // closePane(id);
    if (newRef.current.getAttribute("aria-hidden")) {
      newRef.current.setAttribute("aria-hidden", true);
      newRef.current.className = "fade tab-pane";
    }
  };

  //close current pane
  const closePane = (id) => {
    console.log("close", id);
    const curPane = document.getElementById(`list-group-trips-tabpane-#${id}`);
    if (!curPane) return;
    curPane.setAttribute("aria-hidden", true);
    curPane.className = "fade tab-pane";
  };

  // open trip detail
  const openDetail = (id) => {
    // just incase also close the edit form
    closeEdit();
    closeNew();
    closePane(prevDisplay);
    // set this id as the next value for previous display
    setDisplayId(id);
    const curPane = document.getElementById(`list-group-trips-tabpane-#${id}`);
    curPane.setAttribute("aria-hidden", false);
    curPane.className = "fade tab-pane active show";
  };

  //Record previous values
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  //record currently open display window to be closed when the next one is clicked
  const prevDisplay = usePrevious(displayId);
  useEffect(() => {
    // check if we have been directed here from the invites link and if so get the has value and open the correspodnign trip detail
    if (location?.pathname === "/invites" && location?.hash.length) {
      // Get selected invite id
      const id = location.hash.slice(1);
      invites.find((i) => i.id === +id)
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
                      onClick={() => closeEdit(trip.id)}
                    >
                      {" "}
                      {trip.name}
                    </ListGroup.Item>
                  );
                })
              ) : (
                <ListGroup.Item>
                  {`You don't have any ${
                    location.pathname === "invitations"
                      ? "invitations"
                      : "trips"
                  }right now.`}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Col>
          <Col sm={8}>
            <Tab.Content>
              <Tab.Pane eventKey="#newTrip" ref={newRef}>
                <NewTripForm />
              </Tab.Pane>
              <Tab.Pane eventKey="#editTrip" ref={formRef}>
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
