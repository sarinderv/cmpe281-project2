import { Auth } from 'aws-amplify';
import React, { useState, useEffect } from 'react';

function CreateDoctor() {

    const [userData, setUserData] = useState({ payload: { username: '' } });

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

    return (
        <div className='createdoctor'>
            <h1>Create Doctor</h1>
        </div>
    );
}

export default CreateDoctor;