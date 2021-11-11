import { Auth } from 'aws-amplify';
import { API } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import { getPatient} from '../graphql/queries';
import { useHistory, Redirect } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import UpdatePatientModal from "./UpdatePatientModal";
import Appointment from "./Appointment";


export default function Patient() {

    const [userData, setUserData] = useState({ payload: { username: '' } });
    const [patient, setPatient]= useState({ });
    const [errorMessages, setErrorMessages] = useState([]);
    const history = useHistory();
    const [updateModalShow, setUpdateModalShow] = React.useState(false);
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
        })
        .catch((e) => console.log("Not signed in", e));
    }

    async function getPatientInfo(userName) {
        try {
          const apiData = await API.graphql({ query: getPatient, variables: { id: userName } } );
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
      setUpdateModalShow(true);
    }
    

    return (
        <div className='patient'>
          <h1>Patient Registration</h1>
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
            <h1>Appointment Information</h1>
            <div>
            <Button
                              variant="success"
                              block
                              size="sm"
                              onClick={() => openAppointment(patient)}
                            >
                              Take Appointment
                            </Button>
            </div>

            <Appointment
                  show={updateModalShow}
                  patient={selectedPatient}
                  onUpdated={() => getPatientInfo(patient.id)}
                  onHide={() => setUpdateModalShow(false)}
                />
        </div>
    );
}

