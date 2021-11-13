import { Auth } from 'aws-amplify';
import { API,Storage } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import {  getPatient} from '../graphql/queries';
import { listAppointmentByPatient, listPrescriptionByPatient} from '../graphql/customQueries';
import { useHistory} from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import UpdatePatientModal from "./UpdatePatientModal";
import Appointment from "./Appointment";
import { deleteAppointment } from '../graphql/mutations';
import { AmplifyS3Image } from '@aws-amplify/ui-react';


export default function Patient() {

    const [userData, setUserData] = useState({ payload: { username: '' } });
    const [patient, setPatient]= useState({ });
    const [doctor, setDoctor]= useState({ });
    const [appointments, setAppointments]= useState([]);
    const [prescriptions, setPrescriptions]= useState([]);
    const [errorMessages, setErrorMessages] = useState([]);
    const history = useHistory();
    const [updateModalShow, setUpdateModalShow] = React.useState(false);
    const [updateAppointmentModalShow, setAppointmentModalShow] = React.useState(false);
    const [selectedPatient, setSelectedPatient] = useState([]);

    useEffect(() => {
      fetchUserData();
      
      }, []);

    async function fetchUserData() {
      await Auth.currentAuthenticatedUser()
        .then((userSession) => {
          console.log("userData: ", userSession);
          getPatientInfo(userSession.signInUserSession.accessToken.payload.username);
         
          setUserData(userSession.signInUserSession.accessToken);
          fetchAppointments(userSession.signInUserSession.accessToken.payload.username);
          fetchPrescriptions(userSession.signInUserSession.accessToken.payload.username);
        })
        .catch((e) => console.log("Not signed in", e));
    }

    async function fetchAppointments(userName) {
      console.log("inside fetch appointments" );
      try {
          const apiData = await API.graphql({ query: listAppointmentByPatient, variables: { patientId: userName ,appointmentDate: new Date().toISOString().slice(0, 10) }  });
          console.log(apiData.data.listAppointments.items);
          setAppointments(apiData.data.listAppointments.items);
      }catch(e){
          console.error('error fetching appointments', e);
          setErrorMessages(e.errors);
      }
      
    }


    async function fetchPrescriptions(userName) {
      console.log("inside fetch prescriptions" );
      try {
          const apiData = await API.graphql({ query: listPrescriptionByPatient, variables: { patientId: userName }  });
          console.log(apiData.data.listPrescriptions.items);
          const prescriptionFromAPI  = apiData.data.listPrescriptions.items
          await Promise.all(prescriptionFromAPI.map(async prescription => {
            const content = await Storage.get(apiData.data.listPrescriptions.items[0].fileName,{ level: "private", });
            prescription.content = content;
            return prescription;
            }))


          setPrescriptions(apiData.data.listPrescriptions.items);
      }catch(e){
          console.error('error fetching prescriptions', e);
          setErrorMessages(e.errors);
      }
      
    }

    async function getPatientInfo(userName) {
        try {
          const apiData = await API.graphql({ query: getPatient, variables: { id: userName } } );
          console.log(apiData.data.getPatient)
          if (apiData.data.getPatient == null) {
            history.push("/createpatient")
          }
          setPatient(apiData.data.getPatient);
        } catch (e) {
            console.error('error fetching patient', e);
            setErrorMessages(e.errors);
        }
      }
    
    function openUpdatePatientModal(patient) {
      setSelectedPatient(patient);
      setUpdateModalShow(true);
    }

    function openAppointment(patient) {
      setSelectedPatient(patient);
      setAppointmentModalShow(true);
    }
  
    async function deleteAppointmentById({ id }) {

      try {
        console.log("inside delete appointment " + id);
        const newAppointmentArray = appointments.filter(appointment => appointment.id !== id);
        setAppointments(newAppointmentArray);
        await API.graphql({ query: deleteAppointment, variables: { input: { id } }});
 

      }catch (e) {
          console.error('error deleting appointment', e);
          setErrorMessages(e.errors);
      }
    
    }

    return (
        <div className='patient'>
          <h1>Patient Details</h1>
              <div>
                    <Container>
                      <Row className="align-items-center">
                        <Col style={{ fontSize: "1rem" }}>
                          <b> First Name : </b> {patient.firstName}
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Last Name :</b> {patient.lastName}
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Phone :</b> {patient.phone}
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Address :</b> {patient.address}
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Birthdate :</b> {patient.birthDate ? patient.birthDate.substring(0,"yyy-mm-dd".length+1) : ""}
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                        <b>Sex :</b> {patient.sex}
                      </Col>
                      <Col style={{ fontSize: "1rem" }}>
                        <b>SSN :</b> {patient.ssn}
                      </Col>
                      <Col style={{ fontSize: "1rem" }}>
                        <b>Insurance Number :</b> {patient.insuranceNumber}
                      </Col>
                        <Col>
                            <Button
                              variant="success"
                              block
                              size="sm"
                              onClick={() => openUpdatePatientModal(patient)}
                            >
                              Update
                            </Button>
                          
                        </Col>
                      </Row>
                    </Container>
              </div>
              <UpdatePatientModal
                  show={updateModalShow}
                  patient={selectedPatient}
                  onUpdated={() => getPatientInfo(patient.id)}
                  onHide={() => setUpdateModalShow(false)}
                />





<div >
        <h2>Ongoing treatment</h2>
<table>
      <thead>
        <tr>
          <th>Treated by</th>
          <th>Prescription</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
      {
      prescriptions.map(prescription => (
            <tr key={prescription.id || prescription.patientId} >
              <td>{prescription.doctor != null ? prescription.doctor.firstName +" "+prescription.doctor.lastName : ""}</td>
              <td>
                    {
                      prescription.content && <a href={prescription.content} download={prescription.fileName}>
                        {
                          <AmplifyS3Image level="private" imgKey={prescription.fileName} alt={prescription.fileName.slice(prescription.fileName.lastIndexOf('/') + 1)} /> 
                        }
                      </a>
                    }
                  </td>
              <td>{prescription.description != null ?  prescription.description : ""} </td>              
            </tr>
          ))
        }
      </tbody>
    </table>
    </div>

        <div >
        <h2>Upcoming Appointments</h2>
<table>
      <thead>
        <tr>
          <th>Appointment Date</th>
          <th>Appointment Time</th>
          <th>Doctor Appointed</th>
          <th>Medical condition</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
      {
      appointments.map(appointment => (
            <tr key={appointment.id || appointment.appointmentDate} >
              <td>{appointment.appointmentDate}</td>
              <td>{appointment.appointmentTime}</td>
              <td> {appointment.doctor != null ? appointment.doctor.firstName +" "+appointment.doctor.lastName : ""}</td>
              <td>{appointment.description != null ?  appointment.description : ""} </td>
              <td><button onClick={() => deleteAppointmentById(appointment)}>Delete</button></td>
              
            </tr>
          ))
        }
      </tbody>
    </table>
    </div>

            <div>
            <Container>
          
              <Button 
                              variant="success"
                              block
                              size="sm"
                              onClick={() => openAppointment(patient)}
                            >
                              Take Another Appointment
                            </Button>
              
              </Container>
          
            </div>

            <Appointment
                  show={updateAppointmentModalShow}
                  patient={selectedPatient}
                  onUpdated={() => getPatientInfo(patient.id)}
                  onHide={() => setAppointmentModalShow(false)}
                />
        </div>
    );
}

