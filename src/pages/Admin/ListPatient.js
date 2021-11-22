import API from '@aws-amplify/api';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { getDoctor, getPatient, listDoctors, listPatients } from '../../graphql/queries';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Modal,
  Form,
  Alert
} from "react-bootstrap";
import { createDoctor, deleteDoctor } from '../../graphql/mutations';
import { useFormFields } from '../../lib/hooksLib';
import UpdateDoctorModal from '../UpdateDoctorModal';

export default function ListPatient()
{
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [fields, handleFieldChange] = useFormFields({
    fistName: "",
    lastName: "",
    phone: "",
    address: "",
    birthDate: "",
    sex: "",
    ssn: "",
    insuranceNumber: ""
  });
  const history = useHistory();

  const [listPat, setListPat] = useState([]);

  const [updateModalShow, setUpdateModalShow] = React.useState(false);

  const [singlePatient, setSinglePatient] = useState({
    fistName: "",
    lastName: "",
    phone: "",
    address: "",
    birthDate: "",
    sex: "",
    ssn: "",
    insuranceNumber: ""
    });
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    list();

  },[]);
  async function list()
  {
    try{
      const apiData = await API.graphql({ query: listPatients });

      console.log(apiData);

    if (apiData.data.listPatients.items == null)
    {
      history.push('/createpatient')
    }

    setListPat(apiData.data.listPatients.items);

    } catch (e)
    {
      console.log("Errors fetching Patients...",e);
    }

  }

  function validateForm() {
    try {
      return (
        fields.firstName.length > 0 &&
        fields.lastName.length > 0 &&
        fields.phone.length > 0 &&
        fields.address.length > 0
      );
    } catch (e) {
      return false;
    }
  }

  async function getPatientInfo(id) {
    try {
      const apiData = await API.graphql({ query: getPatient, variables: { id: id } } );
      //console.log(apiData);
      if (apiData.data.getPatient == null) {
        history.push("/createpatient")
      }
      setSinglePatient({
        id:apiData.data.getPatient.id,
        fistName: apiData.data.getPatient.firstName,
        lastName: apiData.data.getPatient.lastName,
        phone: apiData.data.getPatient.phone,
        address: apiData.data.getPatient.address,
        birthDate: apiData.data.getPatient.birthDate,
        sex: apiData.data.getPatient.sex,
        ssn: apiData.data.getPatient.ssn,
        insuranceNumber: apiData.data.getPatient.insuranceNumber        
      });

      setUpdateModalShow(true)
    } catch (e) {
        console.error('error fetching Patient...', e);
        setErrorMessages(e.errors);
    }
  }

  async function deletePatientInfo(id)
  {
    try
    {
      await API.graphql({ query: deleteDoctor, variables: { input: { id : id}}});
    } catch(e)
    {
      console.error('error deleting patient', e);
      setErrorMessages(e.errors);
    }
    alert("Patient Deleted!");
    history.push("/listpatient")

  }

  return(
    <Container>
      <Row>
        <Col className="m-3">
          <Button variant="primary" onClick={ () => {
            history.push("/createpatient")
          } }>Add New Patient</Button>
          
        </Col>
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Birth Date</th>
            <th>Sex</th>
            <th>SSN</th>
            <th>Insurance Number</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        { listPat.map(element => (
          <tr key={element.id}>
            <td>{element.id}</td>
            <td>{element.firstName} {element.lastName}</td>
            <td>{element.phone}</td>
            <td>{element.address}</td>
            <td>{element.birthDate}</td>
            <td>{element.sex}</td>
            <td>{element.ssn}</td>
            <td>{element.insuranceNumber}</td>
            <td>{element.createdAt}</td>
            <td>{element.updatedAt}</td>
            <td>
              <Button variant="primary" onClick={() => getPatientInfo(element.id)}>Edit</Button>{' '}
              <Button variant="danger" onClick={() => deletePatientInfo(element.id)}>Delete</Button>
            </td>
          </tr>
          )) }
        </tbody>
      </Table>
      <UpdateDoctorModal
                  show={updateModalShow}
                  doctor={singlePatient}
                  onUpdated={() => getPatientInfo(singlePatient.id)}
                  onHide={() => setUpdateModalShow(false)}
                />
      </Row>
    </Container>
  )
}