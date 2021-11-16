import { Auth } from 'aws-amplify';

async function userSession() {
    return Auth.currentAuthenticatedUser()
        .catch((e) => console.log("Not signed in", e));
}

async function isRole(group) {
    var userData = await userSession();
    const payload = userData.signInUserSession.accessToken.payload
    return payload && payload['cognito:groups'] && payload['cognito:groups'].includes(group);
}

export async function isAdmin() {
    return isRole('Admins');
}

export async function isDoctor() {
    return isRole('Doctor');
}

export async function userInfo() {
    const userData = await userSession();
    const admin = await isAdmin();
    const doctor = await isDoctor();
    const username = userData.signInUserSession.accessToken.payload.username;
    return (
        <>
            {username} <div className="badge">{admin ? "Admin" : doctor ? "Doctor" : "Patient"}</div>
        </>
    );
}