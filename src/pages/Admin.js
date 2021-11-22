import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Admin() {
  return (
    <Container>
      <Row>
        <Col>
          
        </Col>
        <Col>
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Services</Card.Title>
              <Button variant="primary">List Services</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>2 of 2</Col>
      </Row>
    </Container>
  );
}

export default Admin;
