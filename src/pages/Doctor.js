import { Auth } from 'aws-amplify';
import { API } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import { getDoctor } from '../graphql/queries';
import { useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";

function Doctor() {

    const [userData, setUserData] = useState({ payload: { username: '' } });
    const [doctor, setDoctor] = useState({ });
    const [errorMessages, setErrorMessages] = useState([]);
    const history = useHistory();
    const [addModalShow, setAddModalShow] = React.useState(false);

    useEffect(() => {
      fetchUserData();
      }, []);

    async function fetchUserData() {
      await Auth.currentAuthenticatedUser()
        .then((userSession) => {
          console.log("userData: ", userSession);
          getDoctorInfo(userSession.signInUserSession.accessToken.payload.username);
          setUserData(userSession.signInUserSession.accessToken);
        })
        .catch((e) => console.log("Not signed in", e));
    }

    async function getDoctorInfo(userName) {
        try {
          const apiData = await API.graphql({ query: getDoctor, variables: { id: userName } } );
          if (apiData.data.getDoctor == null) {
            history.push("/createdoctor")
          }
          setDoctor(apiData.data.getDoctor);
        } catch (e) {
            console.error('error fetching doctor', e);
            setErrorMessages(e.errors);
        }
      }
    
    function updateDoctor(id) {
    }

    return (
        <div className='doctor'>
          <h1>Doctor</h1>
              <div>
                    <Container>
                      <Row className="align-items-center">
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Name: </b> {doctor.firstName}
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Last Name:</b> {doctor.lastName}
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Phone:</b> {doctor.phone}
                        </Col>
                        <Col style={{ fontSize: "1rem" }}>
                          <b>Address:</b> {doctor.address}
                        </Col>
                        <Col>
                            <Button
                              variant="success"
                              block
                              size="sm"
                              onClick={() => updateDoctor(doctor.id)}
                            >
                              Update
                            </Button>
                        </Col>
                      </Row>
                    </Container>
              </div>
        </div>
    );
}

export default Doctor;