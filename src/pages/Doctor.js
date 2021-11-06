import { Auth } from 'aws-amplify';
import { API } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import { getDoctor } from '../graphql/queries';
import { useHistory } from "react-router-dom";

function Doctor() {

    const [userData, setUserData] = useState({ payload: { username: '' } });
    const [doctor, setDoctor] = useState({ });
    const [errorMessages, setErrorMessages] = useState([]);
    const history = useHistory();

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

    return (
        <div className='doctor'>
            <h1>Doctor</h1>
            {doctor.firstName}
            {doctor.lastName}
        </div>
    );
}

export default Doctor;