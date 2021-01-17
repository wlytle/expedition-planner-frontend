import React from "react";
import { Tab, ListGroup, Col, Row } from "react-bootstrap";
import NewTripForm from "./NewTripForm";

const Trips = () => {
  return (
    <div>
      <Tab.Container id="list-group-trips" defaultActiveKey="#link1">
        <Row>
          <Col sm={4}>
            <ListGroup className="trip-list">
              <ListGroup.Item action href="#link1">
                New Trip
              </ListGroup.Item>
              <ListGroup.Item action href="#link2">
                Link 2
              </ListGroup.Item>
              <ListGroup.Item className action href="#link3">
                Link 4
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col sm={8}>
            <Tab.Content>
              <Tab.Pane eventKey="#link1">
                <NewTripForm />
              </Tab.Pane>
              <Tab.Pane eventKey="#link2">{"Trip deets"}</Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default Trips;
