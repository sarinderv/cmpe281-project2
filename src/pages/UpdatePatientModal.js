import React, { useState, useRef } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useFormFields } from "../lib/hooksLib";
import { updatePatient } from '../graphql/mutations';
import { API } from 'aws-amplify';

export default function UpdatePatientModal(props) {
  const patient = useRef(null);
  const [errorMessages, setErrorMessages] = useState([]);
  const [fields, handleFieldChange] = useFormFields({
    phone: "",
    address: ""
  });

  function validateForm() {
    try {
      return (
        fields.phone.length > 0 &&
        fields.address.length > 0 
      );
    } catch (e) {
      return false;
    }
  }

  function handlePatientChange(event) {
    validateForm();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await API.graphql({ query: updatePatient, variables: { input: {id: props.patient.id, phone: fields.phone, address: fields.address} } });
    } catch (e) {
      console.error('error updating patient', e);
      setErrorMessages(e.errors);
    }
      alert("Patient Details Updated!");
      fields.description = "";
      fields.address = "";
      props.onUpdated();
      props.onHide();
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Patient
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              value={fields.phone}
              placeholder={props.patient.phone}
              type="text"
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={fields.address}
              placeholder={props.patient.address}
              type="text"
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Button block type="submit" size="lg" disabled={!validateForm()}>
            Update
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}