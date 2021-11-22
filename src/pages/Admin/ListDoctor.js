import API from '@aws-amplify/api';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { getDoctor, listDoctors } from '../../graphql/queries';
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

export default function ListDoctor()
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
  });
  const history = useHistory();

  const [listDoc, setListDoc] = useState([]);

  const [updateModalShow, setUpdateModalShow] = React.useState(false);

  const [singleDoctor, setSingleDoctor] = useState({
    id: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: ""
    });
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    list();

  },[]);
  async function list()
  {
    try{
      const apiData = await API.graphql({ query: listDoctors });

      //console.log(apiData.data.listDoctors.items);

    if (apiData.data.listDoctors.items == null)
    {
      history.push('/createdoctor')
    }

    setListDoc(apiData.data.listDoctors.items);

    } catch (e)
    {
      console.log("Errors fetching Doctors...",e);
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

  async function getDoctorInfo(id) {
    try {
      const apiData = await API.graphql({ query: getDoctor, variables: { id: id } } );
      //console.log(apiData);
      if (apiData.data.getDoctor == null) {
        history.push("/createdoctor")
      }
      setSingleDoctor({
        id: apiData.data.getDoctor.id,
        firstName: apiData.data.getDoctor.firstName,
        lastName: apiData.data.getDoctor.lastName,
        phone: apiData.data.getDoctor.phone,
        address: apiData.data.getDoctor.address
      });

      setUpdateModalShow(true)
    } catch (e) {
        console.error('error fetching service', e);
        setErrorMessages(e.errors);
    }
  }

  async function deleteDoctorInfo(id)
  {
    try
    {
      await API.graphql({ query: deleteDoctor, variables: { input: { id : id}}});
    } catch(e)
    {
      console.error('error deleting doctor', e);
      setErrorMessages(e.errors);
    }
    alert("Doctor Deleted!");
    history.push("/listdoctor")``

  }

  return(
    <Container>
      <Row>
        <Col className="m-3">
          <Button variant="primary" onClick={ () => {
            history.push("/createdoctor")
          } }>Add New Doctor</Button>
          
        </Col>
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>username</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        { listDoc.map(element => (
          <tr key={element.id}>
            <td>{element.id}</td>
            <td>{element.firstName} {element.lastName}</td>
            <td>{element.phone}</td>
            <td>{element.address}</td>
            <td>{element.createdAt}</td>
            <td>{element.updatedAt}</td>
            <td>
              <Button variant="primary" onClick={() => getDoctorInfo(element.id)}>Edit</Button>{' '}
              <Button variant="danger" onClick={() => deleteDoctorInfo(element.id)}>Delete</Button>
            </td>
          </tr>
          )) }
        </tbody>
      </Table>
      <UpdateDoctorModal
                  show={updateModalShow}
                  doctor={singleDoctor}
                  onUpdated={() => getDoctorInfo(singleDoctor.id)}
                  onHide={() => setUpdateModalShow(false)}
                />
      </Row>
    </Container>
  )
}