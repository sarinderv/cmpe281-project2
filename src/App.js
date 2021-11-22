import React, { useState, useEffect } from 'react';
import './App.css';
import { Hub } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import SideNav from './components/SideNav';
import Doctor from './pages/Doctor';
import Patient from './pages/Patient';
import ParsePrescription from './pages/ParsePrescription';
import CreateDoctor from './pages/CreateDoctor';
import CreatePatient from './pages/CreatePatient';
import Admin from './pages/Admin';
import Service from './pages/Service';
import * as User from './components/User';
import ListDoctor from './pages/Admin/ListDoctor';
// see https://docs.amplify.aws/lib/storage/configureaccess/q/platform/js/


function App() {

  const listener = (data) => {
    switch (data.payload.event) {
      case 'signIn':
        console.info('user signed in');
        break;
      case 'signOut':
        console.info('user signed out');
        break;
      case 'signIn_failure':
        console.error('user sign in failed');
        break;
      case 'configured':
        console.info('the Auth module is configured');
        break;
      default:
        console.error('unknown event: ', data.payload.event);
    }
  }
  Hub.listen('auth', listener);

  const [userInfo, setUserInfo] = useState("");

  useEffect(() => {
    User.userInfo().then(str => setUserInfo(str));
  }, []);

  return (
    <div className="App">
          <Router>
            <SideNav />
            <Switch>
              <Route path='/' exact component={Doctor} />
              <Route path='/patient' component={Patient} />
              <Route path='/createpatient' component={CreatePatient} />
              <Route path='/createdoctor' component={CreateDoctor} />
              <Route path="/service" component={Service} />
              <Route path="/prescription" component={ParsePrescription} />

            {/* Admin Routes */}
            <Route path='/listdoctor' component={ListDoctor} />
            </Switch>
          </Router>
      <hr />
      { userInfo }
    </div>
  );
}

export default withAuthenticator(App);
