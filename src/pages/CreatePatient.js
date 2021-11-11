import { Auth } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import { useFormFields } from "../lib/hooksLib";
import { API } from 'aws-amplify';
import "./CreatePatient.css";
import { createPatient } from '../graphql/mutations';

export default function CreatePatient() {

    const [userData, setUserData] = useState({ payload: { username: '' } });
    const [errorMessages, setErrorMessages] = useState([]);
    const [fields, handleFieldChange] = useFormFields({
      fistName: "",
      lastName: "",
      phone: "",
      address: "",
      sex: "",
      ssn: "",
      insuranceNumber: ""
    });
    const history = useHistory();
  
    useEffect(() => {
      fetchUserData();
      }, []);

    async function fetchUserData() {
      await Auth.currentAuthenticatedUser()
        .then((userSession) => {
          console.log("userData: ", userSession);
          setUserData(userSession.signInUserSession.accessToken);
        })
        .catch((e) => console.log("Not signed in", e));
    }

    function validateForm() {
      try {
        return (
          fields.firstName.length > 0 &&
          fields.lastName.length > 0 &&
          fields.phone.length > 0 &&
          fields.address.length > 0 &&
          fields.sex.length > 0 &&
          fields.ssn.length > 0 &&
          fields.insuranceNumber.length > 0
        );
      } catch (e) {
        return false;
      }
    }
  
    async function handleSubmit(event) {
      event.preventDefault();
      try {
        await API.graphql({ query: createPatient, variables: { input: {firstName: fields.firstName, lastName: fields.lastName, id: userData.payload.username, phone: fields.phone, address: fields.address,
            sex: fields.sex, ssn: fields.ssn, insuranceNumber: fields.insuranceNumber} } });
      } catch (e) {
        console.error('error registering patient', e);
        setErrorMessages(e.errors);
      }
      history.push("/patient");
    }
  
    function renderForm() {
      return (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="firstName" size="lg">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={fields.firstName}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="lastName" size="lg">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={fields.lastName}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="phone" size="lg">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              value={fields.phone}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="address" size="lg">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              value={fields.address}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="sex" size="lg">
            <Form.Label>Sex</Form.Label>
            <Form.Control
              type="text"
              value={fields.sex}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="ssn" size="lg">
            <Form.Label>SSN</Form.Label>
            <Form.Control
              type="text"
              value={fields.ssn}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="insuranceNumber" size="lg">
            <Form.Label>Insurance Number</Form.Label>
            <Form.Control
              type="text"
              value={fields.insuranceNumber}
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Button block size="lg" type="submit" disabled={!validateForm()}>
            Register
          </Button>
        </Form>
      );
    }
  
    return <div className="createpatient"> <h1>Register Patient</h1> {renderForm()} </div>;
}
