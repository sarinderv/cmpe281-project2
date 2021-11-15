import React, { useState, useRef, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form, { Select } from "react-bootstrap/Form";
import { useFormFields } from "../lib/hooksLib";
import { createAppointment } from '../graphql/mutations';
import { listDoctors } from '../graphql/queries';
import { API } from 'aws-amplify';

export default function Appointment(props) {
  const appointment = useRef(null);
  const [doctors, setDoctors]= useState([]);
  const date =  new Date();
  const [errorMessages, setErrorMessages] = useState([]);
  const [userData, setUserData] = useState({ payload: { username: '' } });
  const [fields, handleFieldChange] = useFormFields({
    appointmentDate: date.getDate,
    appointmentTime: date.getTime
  });

  useEffect(() => {
    fetchDoctors();
    }, []);

  function validateForm() {
    try {
      return (
        fields.appointmentDate !==  null &&
        fields.appointmentTime !==  null &&
        fields.doctorId !== null &&
        fields.description !== ""
      );
    } catch (e) {
      return false;
    }
  }

  function handleAppointmentChange(event) {
    validateForm();
  }

  async function fetchDoctors() {
    console.log("inside fetch doctors" );
    try {
        const apiData = await API.graphql({ query: listDoctors });
        console.log(apiData.data.listDoctors.items);
        setDoctors(apiData.data.listDoctors.items);
    }catch(e){
        console.error('error fetching doctors', e);
        setErrorMessages(e.errors);
    }
    
  }

  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

  async function handleSubmit(event) {
    event.preventDefault();
    try {
        await API.graphql({ query: createAppointment, variables: { input: {patientId: props.patient.id, doctorId: fields.doctorId, appointmentDate: fields.appointmentDate, appointmentTime: fields.appointmentTime,
           description: fields.description } } });
      } catch (e) {
        console.error('error taking appointment', e);
        setErrorMessages(e.errors);
      }
      alert("Appointment Done!");
      fields.appointmentTime = date.getDate;
      fields.appointmentDate = date.getTime;
      fields.doctorId = "";
      fields.description = "";
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
          Appointment Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="appointmentDate">
            <Form.Label>Appointment Date</Form.Label>
            <Form.Control min = {formatDate(date)}
              value={fields.appointmentDate}
              type="date"
              onChange={handleFieldChange}
            />
          </Form.Group>
          <Form.Group controlId="appointmentTime">
            <Form.Label>Appointment Time</Form.Label>
            <Form.Control
              value={fields.appointmentTime}
              type="time"
              onChange={handleFieldChange}
            />
          </Form.Group>
        <Form.Group controlId="doctorId">
            <Form.Label>Preferred Doctor</Form.Label>
            <Form.Control 
            as="select" onChange={handleFieldChange}
            >
                   {
          doctors.map(doctor => (
                 <option  key={doctor.id || doctor.firstName} value={doctor.id}>{doctor.firstName} {doctor.lastName}</option>  
                
              ))
            }  

            </Form.Control>
        </Form.Group>   

        <Form.Group controlId="description">
            <Form.Label>Reason for visit</Form.Label>
            <Form.Control
              
              value={fields.description}
              type="text"
              onChange={handleFieldChange}
            />
          </Form.Group>  
          <Button block type="submit" size="lg" disabled={!validateForm()}>
            Take Appointment
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}